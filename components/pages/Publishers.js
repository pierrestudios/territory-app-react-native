import React from 'react';
import { Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons, Feather } from 'react-native-vector-icons';
import Swipeout from 'react-native-swipeout';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';
import NavigationService from '../common/nav-service';

import Heading from '../elements/Heading';
import Loading from '../elements/Loading';
import {Link, ButtonLink, ButtonHeader} from '../elements/Button';
import Notice from '../elements/PopupNotice';

import styles, {colors} from '../styles/main';

export default class Publishers extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerRight: (
        <ButtonHeader
          onPress={() => {navigation.setParams({'openPublisherAdd': true})}}
          title={<Feather name="plus" size={24} color="#fff" />}
          color="#fff"
        />
      ),  
      title: Language.translate('All Publishers'),
    }
  };
	componentWillMount() {
		if (!Data.user) return;
 	
		Data.getApiData('publishers')
			.then(publishers => {
				this.setState({publishers}, () => {
					publishers && Data.getApiData('available-territories')
						.then(territories => {
							this.setState({availableTerritories: territories}); 
						});	
				}); 
      })
      .catch(UTILS.logError);
	}
	componentWillReceiveProps(props) {
		if (props.navigation) {			
			if (!!props.navigation.getParam('openPublisherAdd'))
        NavigationService.navigate('PublisherAdd', {addPublisher: this.addPublisher})
		}
	}
	render() {
    const state = this.state || {};
    const props = this.props || {};
		// console.log('render:props', props)
		// console.log('state', state)

		if (!state.publishers || !state.availableTerritories)
			return <Loading />;

		const listings = state.publishers.length ? this.getListings(state.publishers, this, 'Publishers') : <Text>{Language.translate('There are no publishers')}</Text>;
    
    return (
			<View style={[styles.section, styles.content]}>
				<View style={[styles.section, styles['listings-results']]}>
          {listings}
				</View>
				<Notice data={state.noticeMessage} closeNotice={() => this.setState({noticeMessage: null})} />
			</View>
    );
  }
  getListings(data = [], caller, callerName) {
    return (
      <FlatList
        contentContainerStyle={styles.listings}
        extraData={this.state}
				data={data.sort(UTILS.sortPublisher)}
				keyExtractor={(item) => item.publisherId.toString()}
				renderItem={({item}) => (
					<Swipeout key={item.publisherId} right={[
						{
							text: Language.translate('Details'), type: 'primary', onPress: () => this.viewDetails(item) 
            },
            {
							text: Language.translate('Edit'), backgroundColor: colors.green, onPress: () => this.editPublisher(item) 
            }, 
            { text: Language.translate('Delete'), type: 'delete', onPress: () => this.notifyDelete(item, state.user) } // backgroundColor: colors.red  
					]} autoClose={true} close={true}>
					<View style={[styles['listings-item']]}>
            <TouchableOpacity style={[styles['listings-name'], styles['publisher-listings-name']]} onPress={() => this.viewDetails(item) }>
              <Text numberOfLines={1} style={[styles['listings-name-text']]}>{UTILS.diacritics(item.firstName)} {UTILS.diacritics(item.lastName)}</Text>
						</TouchableOpacity>
						<View style={styles["listings-right-arrow"]}>
							<Ionicons name="ios-arrow-forward" size={24} color={colors["grey-lite"]} />
						</View>
					</View>
					</Swipeout>
				)}
			/>
    )
  }
  editPublisher(data) {
    NavigationService.navigate('PublisherEdit', {data, updatePublisher: this.updatePublisher});
  }
  addPublisherModal(caller, callerName) {
		caller.setState({
			noticeMessage: {
				title: Language.translate('Add Publisher'),
				inputs: [
					{label: Language.translate("First Name"), type: 'TextInput', name: 'firstName', autoComplete:"given-name", required: true},
					{label: Language.translate("Last Name"), type: 'TextInput', name: 'lastName', autoComplete:"family-name", required: true},
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
							"firstName": (caller.state.noticeMessage.inputs.find(i => i.name === 'firstName') || {})['value'],
							"lastName": (caller.state.noticeMessage.inputs.find(i => i.name === 'lastName') || {})['value']
						};

						// console.log('postData', postData);
						
						// Add Publisher
						Data.getApiData(`publishers/add`, postData, 'POST')
						.then(res => {
							console.log('then() res', res)

							if (!res || res.error) {
								caller.setState({noticeMessage: {
									...caller.state.noticeMessage,
									errorMesage: 'An error occured: ' 
								}});
							}

							else {
								const newData = caller.state.publishers || [];
								newData.push(res);
								caller.setState({
									noticeMessage: null,
									publishers: newData
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

					const newData = caller.state.noticeMessage.inputs
						.map(i => i.name === e.target.name ? {...i, value: e.target.value, error: ''} : i);	

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
	editPublisherModal(data = [], caller, callerName) {
		caller.setState({
			noticeMessage: {
				title: Language.translate('Edit Publisher Name'),
				inputs: [
					{label: Language.translate("First Name"), type: 'TextInput', name: 'firstName', value: data.firstName, autoComplete:"given-name", required: true},
					{label: Language.translate("Last Name"), type: 'TextInput', name: 'lastName', value: data.lastName, autoComplete:"family-name", required: true},
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
							"firstName": (caller.state.noticeMessage.inputs.find(i => i.name === 'firstName') || {})['value'],
							"lastName": (caller.state.noticeMessage.inputs.find(i => i.name === 'lastName') || {})['value']
						};

						// console.log('postData', postData);
						
						// Update Publisher
						Data.getApiData(`publishers/${data.publisherId}/save`, postData, 'POST')
						.then(res => {
							// console.log('then() data', data)

							if (!res || res.error) {
								caller.setState({noticeMessage: {
									...caller.state.noticeMessage,
									errorMesage: 'An error occured: ' 
								}});
							}

							else if (callerName === 'Publishers') {
								const newData = (caller.state.publishers || []).map(p => {
									if (p.publisherId === data.publisherId)
										return {...data, firstName: postData.firstName, lastName: postData.lastName};
									return p;	
								});
								caller.setState({
									noticeMessage: null,
									publishers: newData
								});
							}

							else if (callerName === 'Publisher') {
								const newData = {...data, firstName: postData.firstName, lastName: postData.lastName};
								caller.setState({
									noticeMessage: null,
									data: newData
								}, () => {
									if (caller.props.updatePublisher && typeof caller.props.updatePublisher === 'function') {
										caller.props.updatePublisher(newData);
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

					const newData = caller.state.noticeMessage.inputs
						.map(i => i.name === e.target.name ? {...i, value: e.target.value, error: ''} : i);	

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
	deletePublisherModal(data = [], caller, callerName) {
		const messageBlock = <div>
			<p>{Language.translate('sure_want_remove_publisher')}</p>
			<p><strong>{data.firstName} {data.lastName}</strong> </p>
		</div>

		caller.setState({
			noticeMessage: {
				title: Language.translate('Remove Publisher'),
				description: messageBlock,
				actions: [
					{label: Language.translate("Cancel"), action: () => caller.setState({noticeMessage: null})},
					{label: Language.translate("Continue"), action: () => {

						// console.log('postData', postData);
						const publisherId = data.publisherId;

						// Delete Publisher
						Data.getApiData(`publishers/${publisherId}/delete`, null, 'POST')
						.then(res => {
							// console.log('then() res', res)

							if (!res || res.error) {
								caller.setState({noticeMessage: {
									...caller.state.noticeMessage,
									errorMesage: 'An error occured ' 
								}});
							}

							else if (callerName === 'Publishers') {
								const newData = (caller.state.publishers || []).filter(p => (
									p.publisherId !== data.publisherId
								));
								caller.setState({
									noticeMessage: null,
									publishers: newData
								});
							}

							else if (callerName === 'Publisher') {
								caller.setState({
									noticeMessage: null,
								}, () => {
									if (caller.props.removePublisher && typeof caller.props.removePublisher === 'function') {
										caller.props.removePublisher(publisherId, true);
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
	viewDetails(data) {
    NavigationService.navigate('PublisherDetails', {data, updatePublisher: this.updatePublisher})
	}
	addPublisher = (addedPublisher) => {
    const publishers = (this.state.publishers || []);
    publishers.push(addedPublisher)
		this.setState({
			publishers
		})
	}
	removePublisher = (publisherId) => {
		this.setState({
			publishers: this.state.publishers.filter(p => p.publisherId !== publisherId)
		})
	}
	updatePublisher = (updatedPublisher) => {
		this.setState({
			publishers: this.state.publishers.map(p => {
				if (p.publisherId === updatedPublisher.publisherId) {
					return updatedPublisher;
				}
				return p;
			})
		})
	}
}