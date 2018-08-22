import { AsyncStorage } from "react-native"
import Api from './api';
import UTILS from './utils';
import NavigationService from './nav-service';

let instance = null;
class Data {
	constructor() {
		if (!instance) {
			instance = this;
		}
		
		this._territories = null; // Note: holds loaded territories by title
		this._territoriesList = null; // Note: holds the list of territories
		this.loadSavedUser()
			.catch(UTILS.logError);

		return instance;
	}
	get user() {
		const user = this._user;

		if (!user || !user.userId) 
			return null;

		user.isAdmin = user.userType === 'Admin';
		user.isManager = user.isAdmin || user.userType === 'Manager';
		user.isEditor = user.isManager || user.userType === 'Editor';
		user.isNoteEditor = user.isEditor || user.userType === 'NoteEditor';
		return user;
	}
	get unAuthUser() {
		return this._user;
	}
	set user(data) {
		this._user = data;
	}
	loadSavedUser = async () => {
		return this.getSavedUser()
			.then(user => {
				if (!user || !user.userId || !user.token) {
					this.reLogin();
					return Promise.reject('Please log in');
				}
				this._user = user;
				return user;
			})
	}
	getSavedUser = async () => {
		try {
			const user = await AsyncStorage.getItem('user');
			if (user) {
				this.user = JSON.parse(user);
				return this.user;
			}
		} catch (error) {
			UTILS.logError(error);
		}
	}
	saveUser = async (user) => {
		try {
			await AsyncStorage.setItem('user', JSON.stringify({ // Save without Promise data
				userType: user.userType,
				userId: user.userId,
				email: user.email,
				token: user.token
			}));
			this.user = user;
		} catch (error) {
			UTILS.logError(error);
		}
	}

	/*
	removeUser = async () => {
		this.user = null;
		try {
			AsyncStorage.removeItem('user');
		} catch (error) {
			UTILS.logError(error);
		}
	}
	*/

	getApiData(url, data, type) {
		if (!this.user) return Promise.reject('User is not logged in');

		return Api(url, data, type, {Authorization: 'Bearer ' + this.user.token})
			.then(apiData => {
				// console.log('apiData', apiData);
				if (!!apiData.refreshedToken && !!this.user && !!this.user.token) {
					console.log('refreshedToken', apiData.refreshedToken);
					this.saveUser({...this._user, token: apiData.refreshedToken});

					// Need to wait for "saveUser" to complete before switching screen
					return new Promise((resolve) => {
						UTILS.waitForIt(() => !!this.user && !!this.user.token && this.user.token === apiData.refreshedToken, () => {
							resolve(Api(url, data, type, {Authorization: 'Bearer ' + this.user.token}))
						});
					})
					.then(newPromise => newPromise)
					
				}

				return apiData;
			})
			.catch(e => {
				console.log('getApiData > catch() Error:', e);
	
				// Unauthorized
				if (typeof e === 'string' && (e.match('Unauthorized') || e.match('Token has expired' )) ) {
					return this.reLogin();
				}

				// Do not display DB errors
				if (typeof e === 'string' && e.match('SQLSTATE')) {
					return Promise.reject('Error: Operation Failed');
				}

				if (e.toString().match('Network request failed')) {
					return this.reLogin();
				}

				// Display error
				return Promise.reject(e);
			});
		
	}
	saveTerritoryData(id, data) {
		this._territories = this._territories || [];
		this._territories[id] = data;
	}
	getTerritoryData(id) {
		return this._territories && this._territories[id];
	}
	saveTerritories(data) {
		this._territoriesList = data;
	}
	getTerritories() {
		return this._territoriesList;
	}
	reLogin() {
		// Just remove token
		const user = this._user || {};
		user.token = '';
		console.log('reLogin:user', user);

		this.saveUser(user);
		
		// Need to wait for "saveUser" to complete before switching screen
		return new Promise((resolve) => {
			UTILS.waitForIt(() => user.token === this._user.token, () => {
				resolve(true);
			});
		})
		.then(() => NavigationService.navigate('Login', {}));
	}
}

export default new Data();