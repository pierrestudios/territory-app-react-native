import React from 'react';
import { Text, View, Button } from 'react-native';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';

import style from '../styles/main';

class UserFn {	
	getListings(data = [], caller, callerName) {
		return data
			.sort(UTILS.sortUser)
			.map(list => (
				<li>
					<Link onClick={(e) => this.deleteUserModal(list, caller, callerName)} class={style['delete-user']}>
						<span>{Language.translate('Delete')}</span>
					</Link>
					<Link onClick={(e) => this.editUserModal(list, caller, callerName)} class={style['edit-user']}>
						<span>{Language.translate('Edit')}</span>
					</Link>
					{!list.publisher ? 
						<Link onClick={(e) => this.attachPublisherModal(list, caller, callerName)} class={style['attach-publisher']}>
							<span>{Language.translate('Attach to publisher')}</span>
						</Link>
					: null}
					<Link onClick={(e) => this.editUserModal(list, caller, callerName)}>
						<span class={style['listings-name']}><strong>{list.publisher ? (list.publisher.firstName + ' ' + list.publisher.lastName) : ''}</strong> {list.email}</span>
					</Link>
				</li>
			));
	}
	editUserModal(data = [], caller, callerName) {
		const messageBlock = <div>
			<p>{Language.translate('Publisher')}</p>
			<p>{data.publisher ? <strong>{data.publisher.firstName + ' ' + data.publisher.lastName}</strong> : <em>None</em>}  </p>
		</div>

		caller.setState({
			noticeMessage: {
				title: Language.translate('Edit User'),
				description: messageBlock,
				inputs: [
					{label: Language.translate("Email"), type: 'TextInput', name: 'email', value: data.email, autoComplete:"nickname", required: true},
					{label: Language.translate("Choose account type"), type: 'SelectBox', name: 'userType', value: UTILS.userTypes.find(t => t.value === data.userType), options: UTILS.userTypes, required: true},
				],
				actions: [
					{label: Language.translate("Cancel"), action: () => caller.setState({noticeMessage: null})},
					{label: Language.translate("Save"), action: () => {

						const errors = caller.state.noticeMessage.inputs.filter(d => (
							d.required && !d.value
						));
						
						console.log('errors', errors);

						if (errors.length) {
							const newData = caller.state.noticeMessage.inputs.map(d => (
								d.required && !d.value ? {...d, error: Language.translate(d.label) + ' ' + Language.translate('is required')} : d
							));
			
							return caller.setState({noticeMessage: {
								...caller.state.noticeMessage,
								inputs: newData
							}});
						}

						const postData = {
							"email": (caller.state.noticeMessage.inputs.find(i => i.name === 'email') || {})['value'],
							"userType": (caller.state.noticeMessage.inputs.find(i => i.name === 'userType') || {})['value']['value']
						};

						console.log('postData', postData);
						
						// Update User
						Data.getApiData(`users/${data.userId}/save`, postData, 'POST')
						.then(res => {
							// console.log('then() data', data)

							if (!res || res.error) {
								caller.setState({noticeMessage: {
									...caller.state.noticeMessage,
									errorMesage: 'An error occured: ' 
								}});
							}

							else if (callerName === 'Users') {
								const newData = (caller.state.users || []).map(p => {
									if (p.userId === data.userId)
										return {...data, email: postData.email, userType: postData.userType};
									return p;	
								});
								caller.setState({
									noticeMessage: null,
									users: newData
								});
							}

							else if (callerName === 'User') {
								const newData = {...data, email: postData.email, userType: postData.userType};
								caller.setState({
									noticeMessage: null,
									data: newData
								}, () => {
									if (caller.props.updateUser && typeof caller.props.updateUser === 'function') {
										caller.props.updateUser(newData);
									}
								});
							}

						})
						.catch(e => {
							caller.setState({noticeMessage: {
								...caller.state.noticeMessage,
								errorMesage: 'An error occured: ' + e
							}});
						});
						
					}, style: {float: 'right', backgroundColor: '#337ab7', color: '#fff'}}
				],
				saveData: (e) => {
					// console.log('e', e);
					const dataObj = e.detail || e.target;

					const newData = caller.state.noticeMessage.inputs
						.map(i => i.name === dataObj.name ? {...i, value: (dataObj.option || dataObj.value), error: ''} : i);	

					// console.log('newData', newData);
	
					caller.setState({noticeMessage: {
						...caller.state.noticeMessage,
						inputs: newData,
						errorMesage: ''
					}});
				}
			}
		});
	}
	deleteUserModal(data = [], caller, callerName) {
		const messageBlock = <div>
			<p>{Language.translate('sure_want_remove_user')}</p>
			<p><strong>{data.publisher ? (data.publisher.firstName + ' ' + data.publisher.lastName) : ''}</strong> {data.email}</p>
		</div>

		caller.setState({
			noticeMessage: {
				title: Language.translate('Remove User'),
				description: messageBlock,
				actions: [
					{label: Language.translate("Cancel"), action: () => caller.setState({noticeMessage: null})},
					{label: Language.translate("Continue"), action: () => {

						// console.log('postData', postData);
						const userId = data.userId;

						// Delete User
						Data.getApiData(`users/${userId}/delete`, null, 'POST')
						.then(res => {
							// console.log('then() res', res)

							if (!res || res.error) {
								caller.setState({noticeMessage: {
									...caller.state.noticeMessage,
									errorMesage: 'An error occured ' 
								}});
							}

							else if (callerName === 'Users') {
								const newData = (caller.state.users || []).filter(p => (
									p.userId !== data.userId
								));
								caller.setState({
									noticeMessage: null,
									users: newData
								});
							}

							else if (callerName === 'User') {
								caller.setState({
									noticeMessage: null,
								}, () => {
									if (caller.props.removeUser && typeof caller.props.removeUser === 'function') {
										caller.props.removeUser(userId, true);
									}
								});
							}

						})
						.catch(e => {
							caller.setState({noticeMessage: {
								...caller.state.noticeMessage,
								errorMesage: 'An error occured: ' + e
							}});
						});
						
					}, style: {float: 'right', backgroundColor: 'red', color: '#fff'}}
				]
			}
		});
	}
	attachPublisherModal(data = [], caller, callerName) {
		const messageBlock = <div>
			<p>{Language.translate('User')}</p>
			<p><strong>{data.email}</strong></p>
		</div>

		caller.setState({
			noticeMessage: {
				title: Language.translate('Attach a Publisher'),
				description: messageBlock,
				inputs: [
					{label: Language.translate("Publishers"), type: 'SelectBox', name: 'publisherId', options: caller.state.unattachedPublishers
					.sort(UTILS.sortPublisher)
					.map(p => (
						{value: p.publisherId, label: p.firstName + ' ' + p.lastName}
					)), required: true},
				],
				actions: [
					{label: Language.translate("Cancel"), action: () => caller.setState({noticeMessage: null})},
					{label: Language.translate("Save"), action: () => {

						const errors = caller.state.noticeMessage.inputs.filter(d => (
							d.required && !d.value
						));

						console.log('errors', errors);

						if (errors.length) {
							const newData = caller.state.noticeMessage.inputs.map(d => (
								d.required && !d.value ? {...d, error: Language.translate(d.label) + ' ' + Language.translate('is required')} : d
							));

							return caller.setState({noticeMessage: {
								...caller.state.noticeMessage,
								inputs: newData
							}});
						}

						const postData = {
							"userId": data.userId,
							"publisherId": (caller.state.noticeMessage.inputs.find(i => i.name === 'publisherId') || {})['value']['value']
						};

						console.log('postData', postData);

						// Update User
						Data.getApiData(`publishers/attach-user`, postData, 'POST')
						.then(res => {
							// console.log('then() data', data)

							if (!res || res.error) {
								caller.setState({noticeMessage: {
									...caller.state.noticeMessage,
									errorMesage: 'An error occured: ' 
								}});
							}

							else if (callerName === 'Users') {
								const newUsersData = (caller.state.users || []).map(u => {
									if (u.userId === data.userId)
										return {...data, publisher: caller.state.unattachedPublishers.find(p => p.publisherId === postData.publisherId) };
									return u;	
								});
								const newUnattachedPublishers = caller.state.unattachedPublishers.filter(p => (
									p.publisherId !== postData.publisherId
								))
								caller.setState({
									noticeMessage: null,
									users: newUsersData,
									unattachedPublishers: newUnattachedPublishers
								});
							}

						})
						.catch(e => {
							caller.setState({noticeMessage: {
								...caller.state.noticeMessage,
								errorMesage: 'An error occured: ' + e
							}});
						});
						
					}, style: {float: 'right', backgroundColor: '#337ab7', color: '#fff'}}
				],
				saveData: (e) => {
					// console.log('e', e);
					const dataObj = e.detail || e.target;

					const newData = caller.state.noticeMessage.inputs
						.map(i => i.name === dataObj.name ? {...i, value: (dataObj.option || dataObj.value), error: ''} : i);	

					// console.log('newData', newData);
	
					caller.setState({noticeMessage: {
						...caller.state.noticeMessage,
						inputs: newData,
						errorMesage: ''
					}});
				}
			}
		});
	}
}
export default new UserFn();