import React from 'react';
import { Text, View, ScrollView, Alert } from 'react-native';

// import IconEmail from 'preact-icons/lib/fa/envelope';
// import IconPassword from 'preact-icons/lib/fa/key';
import { FontAwesome } from '@expo/vector-icons';

import Data from '../common/data';
import Api from '../common/api';
import Language from '../common/lang';
import UTILS from '../common/utils';
import NavigationService from '../common/nav-service';
import getSiteSetting from '../common/settings';

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

		const user = Data.unAuthUser;
		const languageLabels = {
			en: 'English',
			creole: 'Creole'
		};
		const languages = getSiteSetting('languages');
		const defaultLang = !!user && user.lang || getSiteSetting('defaultLang');
		this.setState({languages: languages ? Object.keys(languages).map(l => ({
				value: l, label: languageLabels[l]
			})) : [],
			// Set Default Lang "language" and get "api-url"
			data: {...this.state.data, language: this.state.data.language || {value: defaultLang, label: languageLabels[defaultLang]}, "api-url": user.apiPath},
		});
	}
	render() {
    const state = this.state;
		console.log('UserPrefs:render() state', state)

		if (state.waitingForResponse)
			return <Loading />;

		return (
			<View style={[style.container]}>
				<Heading>{Language.translate('Account Settings')}</Heading>
        	<ScrollView contentContainerStyle={style["scroll-view"]}>
						<Message error={state.errors.message} message={state.data.message} />
						<TextInput showLabel={false} name="api-url" placeholder={Language.translate('Server Url')} onInput={this.saveData} value={this.state.data['api-url']} error={this.state.errors['api-url']} />
						{/* <TextInput name="api-version" placeholder={Language.translate('Version')} onInput={this.saveData} value={this.state.data['api-version']} error={this.state.errors['api-version']} icon={{el: FontAwesome, name:"key"}} /> */}
						<SelectBox 
              name="language" 
              showLabel={false} 
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
							<Link onPress={() => NavigationService.navigate('Login')}>{Language.translate('Sign in')} </Link>
							{/* http://www.territory-app.net/ */}
							<FontAwesome.Button name="info-circle" size={20} onPress={() => console.log('Information')} color={colors["territory-blue"]} underlayColor={'transparent'} backgroundColor={'transparent'} iconStyle={{marginRight: 10}} style={{justifyContent: 'center'}}>
								{Language.translate('More Information')} 
							</FontAwesome.Button>
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
		fetch( this.state.data['api-url'] + (this.state.data['api-url'].slice(-1) === '/' ? '' : '/') + 'validate')
			.then(data => {
				console.log('data', data)
				if (!!data) {
					const apiPath = this.state.data['api-url'];

					// Get "apiUrl" from "apiPath" (Server Url) by removing the version path (for now)
					const apiPathSegs = apiPath.split('/');
					const apiUrl = (apiPathSegs.slice(0, -1)).join('/');

					// console.log('data save', {apiUrl, apiPath})

					Data.saveUser({...Data.unAuthUser, apiUrl, apiPath, lang: this.state.data['language'].value });

					UTILS.waitForIt(() => Data.unAuthUser.apiUrl === apiUrl, () => {
						console.log('Alert:start')
						Alert.alert(
							'Server Url Saved',
							'Your "Server Url" has been saved',
							[
								{text: 'OK', onPress: () => NavigationService.navigate('Login')} // {this.setState({waitingForResponse: false}, () => console.log('Alert:Ok'))}},
							],
							// { cancelable: false }
						);
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