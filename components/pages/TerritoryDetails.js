import React from 'react';
import { Text, View } from 'react-native';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';
import TerritoryFn from '../common/territory-fn';

import Heading from '../elements/Heading';
import Loading from '../elements/Loading';
import {Link, ButtonLink} from '../elements/Button';
// import Notice from '../elements/PopupNotice';

import style from '../styles/main';
import Line from '../elements/Line';

export default class TerritoryDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Territory # ' + navigation.getParam('territoryNumber', '...'),
      headerTitle: null,
      headerTintColor: '#fff',
    }
  }

  addressList = null;
  territoryNumber = null;
  territoryId = null;
  allTerritories = false;

	componentWillMount() {
    this.territoryId = this.props.navigation.getParam('territoryId');
    this.allTerritories = !!this.props.navigation.getParam('allTerritories');

		if (!!this.territoryId) {
			// get details
			Data.getApiData(`territories${(this.allTerritories ? '-all' : '')}/${this.territoryId}`)
				.then(data => {

					// Get "addressId" if reloading page
					const addressId = null; // parseInt(this.props.addressId || 0);

          // console.log('data', data);
          if (!!data && !!data.territoryId) {
            this.setState({
              data: data,
              user: Data.user,
              addressActive: (!!addressId ? data.addresses.find(a => a.addressId === addressId) : null),
              streetsList: UTILS.getStreetsList(data.addresses),
              noticeMessage: null,
              shouldRender: 'Territory'
            }, () => console.log('state', this.state));
            this.props.navigation.setParams({'territoryNumber': data.number})
          }
           
        })
        .catch(UTILS.logError)
		}
	}

  /* 
  shouldComponentUpdate(nextProps, nextState) {
		return !!nextState.shouldRender;
  } 
	
	componentDidUpdate(prevProps, prevState) {
		if (!!this.props.isTerritory) {
			// Note: need to delay this function to prevent "addressActive" to be set to null, when view... is clicked
			setTimeout(() => {
				// this.scrollToActiveAddress()
			}, 1000);
		}

		// this.clearRenderTrigger()
	}
  */

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

		// if "addressId", Load Address Details
		if (!!props.addressId && !!state.addressActive) {
			return (<Address address={state.addressActive} streetsList={state.streetsList} updateAddress={this.updateAddress} all={this.allTerritories} user={state.user} />);
		}

		// if "isAddress", Load Add New Address 
		if (!!props.isAddress) {
			return (<Address streetsList={state.streetsList} territoryId={state.data.territoryId} addAddress={this.addAddress} all={this.allTerritories} user={state.user} />);
		}

		// if "isMap", Load Map
		if (!!props.isMap) {
			return (<div class={style['map-content']}><Map data={state.data} user={state.user} /></div>);
    }
    */

		const listings = TerritoryFn.getListings(state.data, this, state.user, 'Territory');

		return (
			<View style={[style.section, style.content]}>
        <View style={style['territory-heading']}>
          {state.user.isEditor ?
            <ButtonLink onPress={this.viewAddressAdd} customClass={style['add-address-button']}> {Language.translate('Add')} </ButtonLink>
          : null }
          <ButtonLink onPress={this.viewMap} customClass={style['view-map-button']}> {Language.translate('Map')} </ButtonLink>
          {state.user.isManager ? [
            <ButtonLink key="pdf-button" onPress={() => UTILS.openFrameUrl(`pdf/${state.data.number}`)} customClass={style['pdf-button']}> {Language.translate('PDF')} </ButtonLink>,
            <ButtonLink key="csv-button" onPress={() => UTILS.openFrameUrl(`csv/${state.data.number}`)} customClass={style['csv-button']}> {Language.translate('CSV')} </ButtonLink>
          ] : null }
          <View style={style['heading-number']}><Text style={style["listings-number-text"]}>{state.data.number}</Text></View>
          {this.allTerritories && state.data.publisher ?
            <Link style={style['heading-name-link']} onPress={(e) => this.viewPublisherDetails(state.data.publisher)}>
              <Text style={style['heading-name']}>{state.data.publisher.firstName} {state.data.publisher.lastName}</Text>
            </Link>
            : null}
        </View>  
				<View style={[style['listings-results'], style['listings-results-address']]}>
          {listings}
				</View>
				{/*<Notice data={state.noticeMessage} />*/}
			</View>
		);
	}
	viewNotes(data) {
		this.setState({ addressActive: data, shouldRender: 'Notes' }, () => {
			this.props.entity && typeof this.props.entity.viewNotes === 'function' ?
			this.props.entity.viewNotes(data) :
			History.push({
				pathname: `/territories${this.allTerritories ? '-all' : ''}/${this.props.id}/address/${data.addressId}/notes`
			})
		});
	}
	viewAddress(data) {
		this.setState({ addressActive: data, shouldRender: 'addressId' }, () => {
			this.props.entity && typeof this.props.entity.viewAddress === 'function' ?
			this.props.entity.viewAddress(data) :
			History.push({
				pathname: `/territories${this.allTerritories ? '-all' : ''}/${this.props.id}/address/${data.addressId}`
			})
		});
	}
	viewAddressAdd = () => {
		this.props.entity && typeof this.props.entity.viewAddressAdd === 'function' ?
		this.props.entity.viewAddressAdd() :
		History.push({
			pathname: `/territories${this.allTerritories ? '-all' : ''}/${this.props.id}/address/add`
		})
		this.setState({shouldRender: 'Address', addressActive: null})
	}
	viewMap = () => {
		this.props.entity && typeof this.props.entity.viewMap === 'function' ?
		this.props.entity.viewMap() :
		History.push({
			pathname: `/territories${this.allTerritories ? '-all' : ''}/${this.props.id}/map`
		})
		this.setState({shouldRender: 'Map', addressActive: null})
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
		}, () => !!allowGoBack && History.goBack()) 
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

		console.log('newAddress', newAddress);

		this.setState({ data: { ...this.state.data, addresses: addresses}, streetsList: streetsList, shouldRender: 'Territory', addressActive: newAddress }, () => History.goBack());
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