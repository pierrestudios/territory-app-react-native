import React from 'react';
import { Text, View, ScrollView, Alert } from 'react-native';

import { FontAwesome } from 'react-native-vector-icons';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';
import NavigationService from '../common/nav-service';
import getSiteSetting, {userData} from '../common/settings';

import Logo from '../elements/Logo';
import {TextInput, SelectBox} from '../elements/FormInput'; 
import {Button, ButtonLink, Link } from '../elements/Button';
import Heading from '../elements/Heading';
import Message from '../elements/Message'; 
import Loading from '../elements/Loading';
import Line from '../elements/Line';
import LineBlank from '../elements/LineBlank';

import style, { colors } from '../styles/main';

export default class UserPrefs extends React.Component {
	static navigationOptions = {
		...UTILS.headerNavOptionsDefault,
		headerTitle: <Logo />,
		headerLeft: (<View />), // To center on Andriod
		headerRight: (<View />), // To center on Andriod
		headerBackImage: <View /> // Disabled
  };
	state = {
		data: {
			"api-url": '',
			language: ''
		},
		errors: {
			"api-url": '',
			language: '',
			message: ''
		},
		waitingForResponse: false
	}
	componentWillMount() {
		// Hardcode for now
		// TODO: store the language name in the JSON files

		const languageLabels = {
			en: 'English',
			creole: 'Creole'
		};
		const languages = getSiteSetting('languages');
		const apiPath = getSiteSetting('apiPath');
		const lang = getSiteSetting('lang');
		const defaultLang = lang || getSiteSetting('defaultLang');
		this.setState({languages: languages ? Object.keys(languages).map(l => ({
				value: l, label: languageLabels[l]
			})) : [],
			// Set Default Lang "language" and get "api-url"
			data: {...this.state.data, language: this.state.data.language || {value: defaultLang, label: languageLabels[defaultLang]}, "api-url": apiPath},
		});
	}
	render() {
    const state = this.state;
		// console.log('UserPrefs:render() state', state)

		if (state.waitingForResponse)
			return <Loading />;

		const apiPath = getSiteSetting('apiPath');
		const user = Data.user;

			return (
			<View style={[style.container]}>
				<Heading>{Language.translate('Account Settings')}</Heading>
        	<ScrollView contentContainerStyle={style["scroll-view"]}>
						<Message error={state.errors.message} message={state.data.message} />
						<TextInput showLabel={true} name="api-url" placeholder={Language.translate('Server Url')} onInput={this.saveData} value={this.state.data['api-url']} error={this.state.errors['api-url']} />
						{/* <TextInput name="api-version" placeholder={Language.translate('Version')} onInput={this.saveData} value={this.state.data['api-version']} error={this.state.errors['api-version']} icon={{el: FontAwesome, name:"key"}} /> */}
						<SelectBox 
              name="language" 
              showLabel={true} 
              label={Language.translate('Select Language')} 
              options={state.languages} 
							value={{value: state.data.language.value, label: state.data.language.label}} 
							error={state.errors.language} 
              onInput={this.saveOptionData} 
						/>

						<LineBlank />
						
						<Button onPress={this.saveSettings}>{Language.translate('Save')}</Button>

						<Line />

						<View style={style['inner-content']}> 
							{!!apiPath && (!user || !user.token) ? 
								<Link onPress={() => NavigationService.navigate('Login')} textStyle={{fontSize: 16}}>{Language.translate('Sign in')} </Link>
							: !!user && !!user.token ? 
									<Link onPress={() => NavigationService.navigate('Home')} textStyle={{fontSize: 16}}>{Language.translate('Home')} </Link>
							: null }
							<Link onPress={() => NavigationService.navigate('WebViewExternal', {url: 'http://www.territory-app.net/'})} textStyle={{fontSize: 16}}>{Language.translate('More Information')} </Link>
						</View>

					</ScrollView>
			</View>
		);
	}
	saveData = (newValue) => {
		const newData = {...this.state.data, ...newValue};
		this.setState({
			data: newData,
			errors: {
				...this.state.errors,
				[(Object.keys(newValue) || [])[0]]: ''
			}
		});
	}
	saveOptionData = (data) => {
		let newData = {...this.state.data}; 
		if (data['data-name'])
      newData[data['data-name']] = data.option.value; 

		if (data.option && data.option.label)
			newData[data.name] = data.option;

		// console.log('newData', newData);

		this.setState({
			data: newData,
			errors: {
				...this.state.errors,
				[data.name]: ''
			}
		});
	}
	saveSettings = () => {
		// console.log('state', this.state);

		// First, reset errors
		const errors = {
			"api-url": '',
			language: '',
			message: ''
		};

		this.setState({errors, waitingForResponse: true});

		// Validate
		if (!this.state.data['api-url'] || !this.state.data['language'])
			return this.setState({errors: {
				...errors,
				"api-url": !this.state.data['api-url'] ? Language.translate('Server Url is missing') : '',
				language: !this.state.data.language ? Language.translate('Language is missing') : ''
			}, waitingForResponse: false});

		// All good, validate
		fetch( UTILS.addSlashToUrl(this.state.data['api-url']) + 'validate')
			.then(data => {
				console.log('data', data)
				if (!!data) {
					const apiPath = this.state.data['api-url'];

					// Get "apiUrl" from "apiPath" (Server Url) by removing the version path (for now)
					const apiPathSegs = apiPath.split('/');
					const apiUrl = (apiPathSegs.slice(0, -1)).join('/');
					// console.log('data save', {apiUrl, apiPath})

					// Save the user data, first
					Data.saveUser({...Data.unAuthUser, apiUrl, apiPath, lang: this.state.data['language'].value });

					// Wait for the user data to save
					UTILS.waitForIt(() => Data.unAuthUser.apiUrl === apiUrl, () => {

						// Then reload the Settings for the app
						userData.loadSavedUser();

						// Wait for the Settings to load
						UTILS.waitForIt(() => getSiteSetting('apiPath') === apiPath && getSiteSetting('lang') === this.state.data['language'].value, () => {
							// console.log('Alert:start')
							// console.log('getSiteSetting(lang)', getSiteSetting('lang'));
							const user = Data.user;
							Alert.alert(
								'Settings Saved',
								'Your Settings has been saved',
								[
									{text: 'OK', onPress: () => !!user && !!user.token ? NavigationService.navigate('Home') : NavigationService.navigate('Login')}
								],
								// { cancelable: false }
							);

						});

					});	

				} else {
					const errorMessage = typeof e === 'string' ? e : Language.translate('Server Url is not correct');
					this.setState({errors: {
							...errors,
							message: errorMessage
						},
						waitingForResponse: false
					});
				}
			})
			.catch(e => {
				console.log('error', e);
				const errorMessage = typeof e === 'string' ? e : Language.translate('Server Url is not correct');
				this.setState({errors: {
						...errors,
						message: errorMessage
					},
					waitingForResponse: false
				});
			});
	}
}