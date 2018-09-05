import React from 'react';
import { Text, View, ScrollView } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

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

export default class Login extends React.Component {
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
			password: ''
		},
		errors: {
			email: '',
			password: '',
			message: ''
		},
		waitingForResponse: false
	}
	loadUserData() {
		const { user } = Data;

		if (!!user && !!user.email)
			this.setState({data: {...this.state.data, email: user.email}});
	}
	componentDidMount() {
		this.props.navigation.addListener('willFocus', () => {
			this.loadUserData()
		});

		this.loadUserData();
	}
	componentWillUpdate(props, state) {
		// console.log('componentWillUpdate() state', state)

		const user = Data.unAuthUser;

		if (!user || !user.apiUrl) {
			NavigationService.navigate('UserPrefs')
		}

    if (!!state.data && !!state.data.token) {
			NavigationService.navigate('Home')
		}
	}
	render() {
    const state = this.state;
		// console.log('Login:render() state', state)

		if (state.waitingForResponse)
			return <Loading />;

		return (
			<View style={[style.container]}>
				<Heading>{Language.translate('Sign in')}</Heading>
				{!!state.data && !!state.data.token ? <Link href="/">{Language.translate('Home', 'Home')}</Link> :
        <ScrollView contentContainerStyle={style["scroll-view"]}>
						<Message error={state.errors.message} message={state.data.message} />
						<EmailInput name="email" placeholder={Language.translate('Email')} onInput={this.saveData} value={this.state.data.email} error={this.state.errors.email} icon={{el: FontAwesome, name:"envelope"}} />
						<PasswordInput name="password" placeholder={Language.translate('Password')} onInput={this.saveData} value={this.state.data.password} error={this.state.errors.password} icon={{el: FontAwesome, name:"key"}} />
						<Button onPress={this.sendLogin}>{Language.translate('Sign in')}</Button>

						<Line />

						<View style={style['inner-content']}>
							<Link href="/password-retrieve" >{Language.translate('Lost your password')} </Link> 
							<Text style={style["text-center"]}>{Language.translate('Or')}</Text> 
							<Link href="/signup" >{Language.translate('Create an account')} </Link>
							<Link onPress={() => NavigationService.navigate('UserPrefs')}>{Language.translate('Server Url')} </Link>
						</View>

					</ScrollView>
				}
			</View>
		);
	}
	saveData = (newValue) => {
		// console.log('newValue', newValue);
		const newData = {...this.state.data, ...newValue};
		this.setState({data: newData});
	}
	sendLogin = () => {
		// console.log('state', this.state);

		// First, reset errors
		const errors = {
			email: '',
			password: '',
			message: ''
		};

		this.setState({errors, waitingForResponse: true});

		// Validate
		if (!this.state.data.email || !this.state.data.password)
			return this.setState({errors: {
				...errors,
				email: (!this.state.data.email ? Language.translate('Email is missing') : (!UTILS.validEmail(this.state.data.email) ? Language.translate('Invalid email') : '')),
				password: !this.state.data.password ? Language.translate('Password is missing') : ''
			}, waitingForResponse: false});

		if (!UTILS.validEmail(this.state.data.email))
			return this.setState({errors: {
				...errors,
				email: Language.translate('Invalid email')
			}, waitingForResponse: false});

		// All good, send to api
		Api('signin', this.state.data, 'POST')
			.then(data => {
				// console.log('data', data)
				if (data && data.token) {
					// if (History.location.state && History.location.state.error)
						// History.location.state.error = '';

					// Get User data
					Api('auth-user', null, 'GET', {Authorization: 'Bearer ' + data.token})
					.then(user => {
						user.token = data.token;
						const newData = {...this.state.data, ...user};
						Data.saveUser(user);

						// Need to wait for "saveUser" to complete before switching screen
						UTILS.waitForIt(() => !!Data.user && !!Data.user.token, () => {
							this.setState({data: newData, waitingForResponse: false});
						});
					});
				}
			})
			.catch(e => {
				console.log('error', e);
				const errorMessage = typeof e === 'string' && (e.match('email') || e.match('password')) ? e : Language.translate('Sign in failed');
				this.setState({errors: {
						...errors,
						message: errorMessage
					},
					waitingForResponse: false
				});
			});
	}
}