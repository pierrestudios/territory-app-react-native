import React from 'react';
import { Text, View, ScrollView } from 'react-native';

import Data from '../common/data';
import Api from '../common/api';
import Language from '../common/lang';
import UTILS from '../common/utils';

import Logo from '../elements/Logo';
import {EmailInput, PasswordInput} from '../elements/FormInput'; 
import {Button, Link } from '../elements/Button';
import Heading from '../elements/Heading';
import Message from '../elements/Message'; 
import Loading from '../elements/Loading';
import Line from '../elements/Line';

import style from '../styles/main';
import NavigationService from '../common/nav-service';

export default class PasswordRetrieve extends React.Component {
	static navigationOptions = {
		...UTILS.headerNavOptionsDefault,
		headerTitle: <Logo />,
		headerLeft: (<View />), // To center on Andriod
		headerRight: (<View />), // To center on Andriod
		headerBackImage: <View /> // Disabled
  };
	state = {
		data: {
			email: '',
			message: ''
		},
		errors: {
			email: '',
			message: ''
		},
		waitingForResponse: false
  }
	loadUserData() {
		const { user } = Data;

		if (!!user && !!user.email)
			this.setState({data: {...this.state.data, email: user.email, lang: user.lang}});
	}
	componentDidMount() {
		this.props.navigation.addListener('willFocus', () => {
			this.loadUserData()
		});

		this.loadUserData();
	}
	componentWillUpdate(props, state) {
		// console.log('componentWillUpdate() state', state)

    if (!!state.data && !!state.data.token) {
			NavigationService.navigate('Home')
		}
  }
	render() {
    const state = this.state;
		// console.log('PasswordRetrieve:render() state', state)

		if (state.waitingForResponse)
			return <Loading />;

		return (
			<View style={[style.container]}>
				<Heading>{Language.translate('Lost your password')}</Heading>
        <ScrollView contentContainerStyle={style["scroll-view"]}>
					<Message 
						error={state.errors.message} 
						message={state.data.message} 
						/>
					<EmailInput 
						name="email" 
						placeholder={Language.translate('Email')} 
						onInput={this.saveData} 
						value={this.state.data.email} 
						error={this.state.errors.email} 
						icon={{el: 'FontAwesome', name:"envelope"}} 
						/>
					<Button onPress={this.sendRetrieve}>
						{Language.translate('Continue')}
					</Button>

          <Line />

          <View style={style['inner-content']}>
						<Link onPress={() => NavigationService.navigate('Login')} textStyle={{fontSize: 16}}>
							{Language.translate('Sign in')} 
						</Link>
						<Link onPress={() => NavigationService.navigate('UserPrefs')} textStyle={{fontSize: 16}}>
							{Language.translate('Server Url')} 
						</Link>
          </View>

        </ScrollView>
			</View>
		);
	}
	saveData = (newValue) => {
		// console.log('newValue', newValue);
		const newData = {...this.state.data, ...newValue};
		this.setState({data: newData, errors: {
			email: '',
			message: ''
		}});
	}
	sendRetrieve = () => {
		console.log('state', this.state);

		// First, reset errors
		const errors = {
			email: '',
			message: ''
		};

		this.setState({errors, waitingForResponse: true});

		// Validate
		if (!this.state.data.email)
			return this.setState({errors: {
				...errors,
				email: (!this.state.data.email 
					? Language.translate('Email is missing') 
					: (!UTILS.validEmail(this.state.data.email) ? Language.translate('Invalid email') : '')),
			}, waitingForResponse: false});
      
		// All good, send to api
		Api('password-retrieve/' + this.state.data.lang || 'en', {
			email: this.state.data.email,
		}, 'POST')
			.then(data => {
        console.log('data', data);
				if (data && data.message) {
					this.setState({data: {
						...this.state.data,
						message: data.message
					}, waitingForResponse: false});
				}
			})
			.catch(e => {
				console.log('error', e);
        const errorMessage = e;
				this.setState({errors: {
						...errors,
						message: errorMessage
					},
					waitingForResponse: false
				});
			});
	}
}