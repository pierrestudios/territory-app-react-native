import React from 'react';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';
import NavigationService from '../common/nav-service';

import Heading from '../elements/Heading';
import Loading from '../elements/Loading';
import {Link, ButtonLink, ButtonHeader} from '../elements/Button';
import Notice from '../elements/PopupNotice';

import style, {colors} from '../styles/main';

export default class TerritoryDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: `${Language.translate('Territory')} ${navigation.getParam('territoryNumber', '...')}`,
      headerRight: (
        !!navigation.getParam('isEditor') && !!navigation.getParam('streetsList') ? 
				<ButtonHeader
					onPress={() => {navigation.navigate('AddressAdd', {
						streetsList: navigation.getParam('streetsList'), 
						territoryId: navigation.getParam('territoryId'),
						addAddress: (newAddress) => navigation.setParams({newAddress})
					})}}
					title={<Feather name="plus" size={24} color="#fff" />}
					color="#fff"
        />
        : null
			),
    }
  }

  addressList = null;
  territoryNumber = null;
  territoryId = null;
  allTerritories = false;

	componentWillReceiveProps(props) {
		if (props.navigation) {			
			if (!!props.navigation.getParam('newAddress'))
				this.addAddress(props.navigation.getParam('newAddress'));
		}
	}
	componentWillMount() {
    this.territoryId = this.props.navigation.getParam('territoryId');
    this.allTerritories = !!this.props.navigation.getParam('allTerritories');

		if (!!this.territoryId) {
			// get details
			Data.getApiData(`territories${(this.allTerritories ? '-all' : '')}/${this.territoryId}`)
				.then(data => {

					// Get "addressId" if reloading page
          const addressId = null; // parseInt(this.props.addressId || 0);
          const {user} = Data

          // console.log('data', data);
          if (!!data && !!data.territoryId) {
            const streetsList = UTILS.getStreetsList(data.addresses);
            this.setState({
              data: data,
              user: user,
              addressActive: (!!addressId ? data.addresses.find(a => a.addressId === addressId) : null),
              streetsList: streetsList,
              noticeMessage: null,
              shouldRender: 'Territory'
            });

            // Set params for Navigation Header
            this.props.navigation.setParams({
              territoryNumber: data.number, 
              isEditor: user.isEditor,
              streetsList: streetsList
            })
          }
           
        })
        .catch(UTILS.logError)
		}
	}

	render() {
    const state = this.state || {};
    const props = this.props || {};
		// console.log('render:state', state)
		// console.log('render:props', props);

		if (!state.data)
			return <Loading />;

    /*  
		// if "isNotes", Load Address Details
		if (!!props.isNotes && !!state.addressActive) {
			return (<Notes address={state.addressActive} updateAddress={this.updateAddress} all={this.allTerritories} user={state.user}  />);
		}

		// if "isMap", Load Map
		if (!!props.isMap) {
			return (<div class={style['map-content']}><Map data={state.data} user={state.user} /></div>);
    }
    */

		const listings = (
			<FlatList
				contentContainerStyle={style.listings}
				data={state.data.addresses.sort(UTILS.sortAddress)}
				keyExtractor={(item) => item.addressId.toString()}
				renderItem={({item}) => (
					<Swipeout key={item.addressId} right={[
						{
							text: Language.translate('Notes'), type: 'primary', onPress: () => this.viewNotes(item) 
						}, 
						state.user.isEditor ? {
							text: Language.translate('Delete'), type: 'delete', onPress: () => this.notifyDelete(item, state.user) // backgroundColor: colors.red
						} : { text: ''}
					]} autoClose={true} close={true}>
					<View style={[style['listings-item']]}>
            <TouchableOpacity style={style['listings-notes']} onPress={() => state.user.isNoteEditor ? this.viewNotes(item) : console.log('Not Note Editor')}>
              {item.notes && item.notes.length ? [
                <Text key="listings-date" style={[style['listings-date-text'], style['listings-notes-date-text']]}>
                  {item.notes[0].date}
                </Text>,
                <Text key="listings-notes" numberOfLines={1} style={style['listings-notes-note-text']}>
                  {UTILS.diacritics(item.notes[0].note)}
                </Text>
              ] : [
								state.user.isNoteEditor ? 
									<ButtonLink key="listings-add-notes" customStyle={[style['add-notes']]} onPress={() => this.viewNotes(item)}>{Language.translate('Add Notes')}</ButtonLink>
									: null
              ]}
            </TouchableOpacity>	
            <TouchableOpacity style={[style['listings-name'], style['address-listings-name']]} onPress={() => state.user.isEditor ? this.viewAddress(item) : console.log('Not Editor')}>
              <Text numberOfLines={1} style={[style['listings-name-text'], style['listings-address-name']]}>{UTILS.diacritics(item.name)} </Text>
              <Text numberOfLines={1} style={style['listings-address']}>
							  {UTILS.getListingAddress(item)}
						  </Text>
						</TouchableOpacity>
						<View style={style["listings-right-arrow"]}>
							<Ionicons name="ios-arrow-forward" size={24} color={colors["grey-lite"]} />
						</View>
					</View>
					</Swipeout>
				)}
			/>
		);

		return (
			<View style={[style.section, style.content]}>
        <View style={style['territory-heading']}>
          <ButtonLink onPress={this.viewMap} customStyle={[style["heading-button-link"], style['view-map-button']]} textStyle={style["heading-button-link-text"]} textColorWhite> {Language.translate('Map')} </ButtonLink>
          {state.user.isManager ? [
            <ButtonLink key="pdf-button" onPress={() => UTILS.openFrameUrl(`pdf/${state.data.number}`)} customStyle={[style["heading-button-link"], style['pdf-button']]} textStyle={style["heading-button-link-text"]} textColorWhite> {Language.translate('PDF')} </ButtonLink>,
            <ButtonLink key="csv-button" onPress={() => UTILS.openFrameUrl(`csv/${state.data.number}`)} customStyle={[style["heading-button-link"], style['csv-button']]} textStyle={style["heading-button-link-text"]} textColorWhite> {Language.translate('CSV')} </ButtonLink>
          ] : null }
          <View style={style['heading-number']}><Text style={style["listings-number-text"]}>{state.data.number}</Text></View>
          {/*
          {this.allTerritories && state.data.publisher ?
            <ButtonLink style={style['heading-name-link']} onPress={(e) => this.viewPublisherDetails(state.data.publisher)}>
              <Text style={style['heading-name']}>{state.data.publisher.firstName} {state.data.publisher.lastName}</Text>
            </ButtonLink>
            : null}
          */}  
        </View>  
				<View style={[style.section, style['listings-results'], style['listings-results-address']]}>
          {listings}
				</View>
				<Notice data={state.noticeMessage} closeNotice={() => this.setState({noticeMessage: null})} />
			</View>
		);
	}
	viewNotes(data) {
		console.log('viewNotes', data)
		this.setState({ addressActive: data, shouldRender: 'Notes' }, () => {
			this.props.entity && typeof this.props.entity.viewNotes === 'function' ?
			this.props.entity.viewNotes(data) : 
			NavigationService.navigate('Notes', {
				addressActive: data, 
				updateAddress: this.updateAddress, 
				territoryId: data.territoryId,
			});
		});
	}
	viewAddress(data) {
		this.setState({ addressActive: data, shouldRender: 'addressId' }, () => {
			this.props.entity && typeof this.props.entity.viewAddress === 'function' ?
      this.props.entity.viewAddress(data) : 
      NavigationService.navigate('AddressEdit', {
				addressActive: data, 
				streetsList: this.state.streetsList, 
				territoryId: data.territoryId,
				updateAddress: this.updateAddress
			});
		});
	}
	viewAddressAdd = () => {
		this.props.entity && typeof this.props.entity.viewAddressAdd === 'function' ?
		this.props.entity.viewAddressAdd() : false
		this.setState({shouldRender: 'Address', addressActive: null})
	}
	viewMap = () => {
		this.props.entity && typeof this.props.entity.viewMap === 'function' ?
		this.props.entity.viewMap() : false
		/* History.push({
			pathname: `/territories${this.allTerritories ? '-all' : ''}/${this.props.id}/map`
		}) */
		this.setState({shouldRender: 'Map', addressActive: null})
	}

	notifyDelete = (list, user) => {
		const messageBlock = (
			<View>
				<Text style={{fontSize: 16}}>{Language.translate('Delete_Address_Sure')}</Text>
				<Text style={[style["text-strong"], {fontSize: 16}]}>{list.name} {UTILS.getListingAddress(list)}</Text>
			</View>
		);

		this.setState({
			noticeMessage: {
				title: Language.translate('Remove Address'),
				description: messageBlock,
				inputs: [
					{label: Language.translate("Reason"), type: 'TextInput', name: 'note', required: true},
					{label: Language.translate("Remove Completely"), name: 'delete', type: user.isManager ? 'Switch' : ''},
				],
				actions: [
					{label: Language.translate("Continue"), action: () => {
						const errors = this.state.noticeMessage.inputs.filter(d => (
							d.required && !d.value
						));
						
						console.log('errors', errors);

						if (errors.length) {
							const newData = this.state.noticeMessage.inputs.map(d => (
								d.required && !d.value ? {...d, error: d.name === 'note' ? Language.translate('Enter your reason for removing address') : d.name + ' is required'} : d
							));
			
							this.setState({noticeMessage: {
								...this.state.noticeMessage,
								inputs: newData
							}, shouldRender: 'Modal'}, () => console.log('state', this.state));

							return;
						}

						let postData = {};
						this.state.noticeMessage.inputs.forEach(d => {
							postData[d.name] = d.value;
						})

						console.log('postData', postData); // return;
						
						// Delete address
						Data.getApiData(`addresses/remove/${list.addressId}`, {delete: postData.delete, note: postData.note}, 'POST')
						.then(data => {
							console.log('then() data', data)
							
							if (!data) {
								return this.setState({noticeMessage: {
									...this.state.noticeMessage,
									errorMesage: 'An error occured: ' + e
								}, shouldRender: 'Modal'});
							}

							if (typeof this.updateAddress === 'function') {
								this.updateAddress({...list, inActive: !postData.delete}, postData.delete, false);
								// NOTE: "Reason" note not included in Address.notes
							}

						})
						.catch(e => {
							this.setState({noticeMessage: {
								...this.state.noticeMessage,
								errorMesage: 'An error occured: ' + e
							}, shouldRender: 'Modal'});
						});
						
					}, 
					style: {backgroundColor: colors.red}, 
					textStyle: { color: colors.white }
				},
				{label: Language.translate("Cancel"), action: () => this.setState({noticeMessage: null, shouldRender: 'Territory'})},
			],
				saveData: (data) => {
					console.log('data', data);

					const newData = this.state.noticeMessage.inputs.map(d => {
						if (d.name === (Object.keys(data) || {})[0]) return {
							...d,
							value: data[d.name],
							error: ''
						}
						return d;
					});
	
					this.setState({noticeMessage: {
						...this.state.noticeMessage,
						inputs: newData,
						errorMesage: ''
					}, shouldRender: 'Modal'});
				}
			},
			shouldRender: 'Territory'
		});
	}
	updateAddress = (updatedAddress, isDelete = false, allowGoBack = true) => {
		const updatedAddresses = isDelete ? this.state.data.addresses.filter(a => (
			a.addressId !== updatedAddress.addressId
		))
			: this.state.data.addresses.map(a => {
				if (a.addressId === updatedAddress.addressId)
					return updatedAddress;
				return a;
			})
		const updatedData = { ...this.state.data, addresses: updatedAddresses }

		this.setState({
			data: updatedData,
			noticeMessage: null,
			shouldRender: 'Territory'
    }) 
	}
	addAddress = (newAddress) => {
		if (!newAddress) return;

		let addresses = this.state.data.addresses.slice();

		// First, double check for dup
		const addressExist = addresses.find(({addressId}) => addressId === newAddress.addressId);
		if (!addressExist)
			addresses.push(newAddress);
		else {
			addresses = addresses.map(a => {
				if (a.addressId === newAddress.addressId)
					return newAddress;
				return a;
			})
		}

		// Add new Street to streetsList
		const streetsList = this.state.streetsList.slice();
		if (newAddress.street) {
			// First, double check for dup
			const streetExist = streetsList.find(({streetId}) => streetId === newAddress.street.streetId);
			if (!streetExist)
				streetsList.push(newAddress.street);
			
		}

		// console.log('newAddress', newAddress);

		this.setState({ data: { ...this.state.data, addresses: addresses}, streetsList: streetsList, shouldRender: 'Territory', addressActive: newAddress });
	}
	viewPublisherDetails() {
		// Disable for now
	}
	scrollToActiveAddress = () => {
		if (!!this.state.addressActive && !!this.addressList && this.state.data && this.state.data.addresses) {
			// console.log('scrollToActiveAddress:addressActive', this.state.addressActive)
			const inx = this.state.data.addresses.findIndex(({addressId}) => addressId === this.state.addressActive.addressId);
			const inxAbove = (inx - 1);
			const listElms = this.addressList.getElementsByTagName('li');
			// offsetTop
			inxAbove > 5 && listElms && listElms[inxAbove] && !this.isInViewport(listElms[inxAbove]) && listElms[inxAbove].scrollIntoView();
			// console.log('listElms[inxAbove]', listElms[inxAbove])
		}
	}
	isInViewport = function(el) {
		const elementTop = el.offsetTop;
		const elementBottom = elementTop + el.offsetHeight;
		const viewportTop = window.screen.top;
		const viewportBottom = viewportTop + window.screen.height;
		// console.log('pos', {elementBottom, viewportTop, elementTop, viewportBottom});
		
		return elementBottom > viewportTop && elementTop < viewportBottom;
	}
	clearRenderTrigger = () => {
		// Note: Need to remove triggers for update, "shouldRender" for each entity (Territory, Address, addressId, Notes, Map)
		if (this.state.shouldRender && this.state.data) {
			if (!!this.props.isTerritory && this.state.shouldRender === 'Territory')
				this.setState({shouldRender: ''})

			else if (!!this.props.addressId && this.state.shouldRender === 'addressId')
				this.setState({shouldRender: 'Territory'})	// Note: it should render  "Territory" next

			else if (!!this.props.isAddress && this.state.shouldRender === 'Address')
				this.setState({shouldRender: 'Territory'})	// Note: it should render  "Territory" next

			else if (!!this.props.isNotes && this.state.shouldRender === 'Notes')
				this.setState({shouldRender: 'Territory'})	// Note: it should render  "Territory" next

			else if (!!this.props.isMap && this.state.shouldRender === 'Map')
				this.setState({shouldRender: 'Territory'})	// Note: it should render  "Territory" next

			else if (!!this.props.isMap && this.state.shouldRender === 'Modal')
				this.setState({shouldRender: 'Territory'})	// Note: it should render  "Territory" next	
		}
	}
}