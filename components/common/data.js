import { AsyncStorage } from "react-native"
// import History from './history';
import Api from './api';
import UTILS from './utils';
import NavigationService from './nav-service';

let instance = null;
class Data {
	constructor() {
		if (!instance) {
			instance = this;
		}
		
		// Fake data
		/*
		this._user = {
			userType: 'Admin',
			userId: 2,
			email: 'territoryapi@gmail.com',
			token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjIsImlzcyI6Imh0dHA6Ly90ZXJyaXRvcnktYXBpLWRldi5oZXJva3VhcHAuY29tL3YxL3NpZ25pbiIsImlhdCI6MTUzMzQwNjM1NCwiZXhwIjoxNTMzNDA5OTU0LCJuYmYiOjE1MzM0MDYzNTQsImp0aSI6ImQ3S0VlN1lIeGZtNW5McjQifQ.-Jp7sxcwHT_0pwPt_dWNa8VDYfUqTCKwpYPfv_y2LSU'
		};
		*/ 
		
		this._territories = null; // Note: holds loaded territories by title
		this._territoriesList = null; // Note: holds the list of territories
		this._user = this.getSavedUser();

		// if (!this._user || !this._user.userId)
			// this.reLogin();

		return instance;
	}
	get user() {
		const user = this._user;
		if (!user || !user.userId) 
			return;

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
			await AsyncStorage.setItem('user', JSON.stringify({
				userType: user.userType,
				userId: user.userId,
				email: user.email,
				token: user.token
			}));
			this.user = this.getSavedUser();
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
					return Api(url, data, type, {Authorization: 'Bearer ' + this.user.token})
				}

				return apiData;
			})
			.catch(e => {
				console.log('getApiData > catch() Error', e);
	
				// Unauthorized
				if (typeof e === 'string' && e.match('Unauthorized')) {
					return this.reLogin();
				}

				// Do not display DB errors
				if (typeof e === 'string' && e.match('SQLSTATE')) {
					return Promise.reject('Error: Operation Failed');
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
		const user = {...this._user, token: ''};
		this.saveUser(user);
		NavigationService.navigate('Login', {});
	}
}

export default new Data();