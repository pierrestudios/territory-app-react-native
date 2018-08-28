import Data from './data';
import getSiteSetting from './settings';

const API_URL = getSiteSetting('apiPath') + '/';

export default (url, data, type = 'GET', headerData = undefined) => (
	fetch( API_URL + url, {
		method: type,
		headers: {
			...headerData,
			 'Content-Type': 'application/json'
		},
		body: data ? JSON.stringify(data) : undefined // Fix for Edge "TypeMismatchError"
	})
		.then((res) => {
			console.log('res', res);
			// const json = res.json();
			// console.log('json', json);
			// catch HTTP "Token" Errors
			if (!res.ok && (!!res.statusText && (res.statusText.match('Token') || res.statusText.match('Unauthorized')))) {
				Data.reLogin();
				return Promise.reject(res.statusText);
			}

			// catch HTTP Errors
			if (!res.ok) {
				return res.json()
					.then((json) => {
						// console.log('json', json);
						// let error = new Error(json.error || res.statusText);
						// error.response = res;
						// throw error;
						return Promise.reject(json.error);
					})
					.catch((E) => {
						// console.log('E', E);
						// console.log('res.statusText', res.statusText);
						return Promise.reject(E || res.statusText);
					});
			}

			return res.json();
		})
		.then((Response) => {
			// Catch Form Validation errors
			// console.log('res', Response)
			if ('error' in Response) {
				if (Response.error && typeof Response.error === 'string') {
					return Promise.reject(Response.error);
				}

				if (typeof Response.error === 'object' && 'email' in Response.error && !!Response.error.email.length) {
					return Promise.reject(Response.error.email[0]);
				}

				if (typeof Response.error === 'object' && 'password' in Response.error && !!Response.error.password.length) {
					return Promise.reject(Response.error.password[0]);
				}
			}

			return Response;
		})
		// Check for Token
		.then((json) => {
			if (json.token) 
				return {data: {token: json.token}};
			return json;
		})
		.then((json) => json.data)
		.catch(e => {
			console.log('Api > catch() Error', e);

			return Promise.reject(e);
		})
);

export const FileUpload = (url, formData, headerData) => (
	fetch('/api/' + url, {
		method: 'POST',
		headers: {
			...headerData
		},
		body: formData
	})
	.then(Response => Response.json())
);