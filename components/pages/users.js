import React from 'react';
import { Text, View, Button } from 'react-native';

import Data from '../common/data';
import Language from '../common/lang';
// import Heading from '../../common/elements/Heading';
import Loading from '../elements/loading';
// import Notice from '../elements/popup-notice';
import UserFn from './user-fn';

import style from '../styles/main';

export default class Users extends React.Component {
  static navigationOptions = {
    headerTitle: null,
    title: 'Territory Users',
    headerTintColor: '#fff',
  };
	componentWillMount() {
		if (!Data.user) return;
   
    return;

		Data.getApiData('users')
			.then(users => {
				this.setState({users}, () => {
					users && Data.getApiData('publishers/filter', {"userId": null}, 'POST')
						.then(publishers => {
							this.setState({unattachedPublishers: publishers}); 
						});	
				}); 
			});

	}
	
	render() {
    // console.log('render:props', props)
    const state = this.state || {};
		// console.log('state', state)

		if (!state.users)
			return <Loading />;

		const listings = state.users.length ? UserFn.getListings(state.users, this, 'Users') : <span>{Language.translate('There are no users')}</span>;
		
		return (
			<div class={classNames(style.section, style.content)}>
				<Heading>
					<span>{Language.translate('Users')}</span>
				</Heading>
				<div class={style['users-results']}>
					<ul>
						{[
							<li class="users-headers">
								<a style="float: right;">
									<span class={style['listings-action']}><strong>{Language.translate('Action')}</strong></span>
								</a>
								<a>
									<span class={style['listings-headers-number']}><strong>{Language.translate('Publisher')} - {Language.translate('User')}</strong></span>
								</a>
							</li>,
							listings
						]}
					</ul>
				</div>
          {/*<Notice data={state.noticeMessage} />*/}
			</div>
		);
	}
}