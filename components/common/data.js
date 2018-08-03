// import History from './history';
import Api from './api';

let instance = null;
class Data {
	constructor() {
		if (!instance) {
			instance = this;
		}
		
		this._previousUrl = ''; // localStorage.getItem('previousUrl'); // Note: holds previousUrl for page
		this._currentUrl = ''; // localStorage.getItem('currentUrl'); // Note: holds currentUrl for page
		// Fake data
		this._user = {
      userType: 'Admin',
      email: 'fake@emal.com'
    }; // JSON.parse(localStorage.getItem('user') || null);
		this._territories = null; // Note: holds loaded territories by title
		this._territoriesList = null; // Note: holds the list of territories
		return instance;
	}
	get previousUrl() {
		return this._previousUrl;
	}
	set previousUrl(url) {
		this._previousUrl = url;
		// localStorage.setItem('previousUrl', url);
	}
	get currentUrl() {
		return this._currentUrl;
	}
	set currentUrl(url) {
		this._currentUrl = url;
		// localStorage.setItem('currentUrl', url);
	}
	get user() {
		const user = this._user;
		if (!user) 
			return;

		user.isAdmin = user.userType === 'Admin';
		user.isManager = user.isAdmin || user.userType === 'Manager';
		user.isEditor = user.isManager || user.userType === 'Editor';
		user.isNoteEditor = user.isEditor || user.userType === 'NoteEditor';
		return user;
	}
	set user(data) {
		this._user = data;
	}
	saveUser(user) {
		this.user = user;
		// localStorage.setItem('user', JSON.stringify(user));
	}
	removeUser() {
		this.user = null;
		// localStorage.removeItem('user');
	}

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
    this.removeUser();
    /*
		setTimeout(() => {
			History.push({
				pathname: '/login',
				state: {
					...History.location.state,
					error: 'Your session has expired. Please login.'
				}
			});
    }, 1000);
    */
	}
}

export default new Data();