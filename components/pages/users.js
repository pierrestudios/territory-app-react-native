import React from 'react';
import { Text, View } from 'react-native';

import Data from '../common/data';
import Language from '../common/lang';
import UserFn from './user-fn';

import Heading from '../elements/Heading';
import Loading from '../elements/Loading';
// import Notice from '../elements/popup-notice';

import styles from '../styles/main';

export default class Users extends React.Component {
  static navigationOptions = {
    headerTitle: null,
    title: 'Territory Users',
    headerTintColor: '#fff',
  };
	componentWillMount() {
		if (!Data.user) return;
   
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

		const listings = state.users.length ? UserFn.getListings(state.users, this, 'Users') : <Text>{Language.translate('There are no users')}</Text>;
		
		// const keyExtractor = (item) => item.userId.toString();
		// console.log('state.users.length', state.users.length);
		// console.log('state.users[0]', state.users[0]);
		// renderItem({ item: Object, index: number, separators: { highlight: Function, unhighlight: Function, updateProps: Function(select: string, newProps: Object) } }) => ?React.Element

		return (
			<View style={[styles.section, styles.content]}>
				<Heading>{Language.translate('Users')}</Heading>
				<View style={styles['users-results']}>
					{listings}
				</View>
          {/*<Notice data={state.noticeMessage} />*/}
			</View>
		);
	}
}