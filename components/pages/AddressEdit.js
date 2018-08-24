import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome, EvilIcons, Feather } from '@expo/vector-icons';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';

import Heading from '../elements/Heading';
import Loading from '../elements/Loading';
import Message from '../elements/Message';
import Line from '../elements/Line';
import {Link, ButtonLink, Button, ButtonIcon, ButtonHeader} from '../elements/Button';
import Notice from '../elements/PopupNotice';
import {TextInput, NumberInput, PhoneInput, DateInput, RadioBox, Switch, SelectBox} from '../elements/FormInput';
import Modal from '../elements/Modal';

import style, { colors } from '../styles/main';

export default class AddressEdit extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate('Edit Address'),
      headerRight: (
				<ButtonHeader
					onPress={() => {navigation.setParams({saveAddress: true})}}
					title="Save"
					color="#fff"
        />
			),
    }
  }

  addressContainer = null
	state = {
		streetsList: [], // only local, for managing list of streets for territory
		data: {
			territoryId: null,
			inActive: false,
			isApt: false,
			name: '',
			address: '',
			apt: '',
			phone: '',
			streetId: null,
			streetName: '',
			street: null,
			isDuplex: false, // only local, for handling RadioBox options
			noticeMessage: null
		},
		noteData: {
			note: '',
			date: UTILS.getToday(),
		},
		errors: {
			inActive: false,
			isApt: false,
			name: '',
			address: '',
			apt: '',
			phone: '',
			street: '',
			message: ''
		},
		newStreetData: null,
    user: null,
    AddressTypeModal: false
  }
  setModalVisible(modal) {
    this.setState(modal);
	}
	componentWillReceiveProps(props) {
		if (props.navigation) {			
			if (!!props.navigation.getParam('saveAddress'))
				this.saveAddress();
		}
	}
	componentWillMount() {
    const {navigation} = this.props;
		if (!!navigation.getParam('addressActive') && !!navigation.getParam('streetsList')) {
			this.setState({
				data: {...navigation.getParam('addressActive'), address: (navigation.getParam('addressActive').address.replace('APT ', ''))},
				streetsList: navigation.getParam('streetsList'),
				user: Data.user
			});
		} else if (!!navigation.getParam('streetsList')) {
			const data = {...this.state.data, territoryId: (navigation.getParam('territoryId') ? navigation.getParam('territoryId')  : null)}
			this.setState({
				data,
				streetsList: navigation.getParam('streetsList'),
				user: Data.user
			});
		}
	}
	componentDidMount() {
		this.scrollToTop()
	}
	render() {
    const state = this.state || {};
    const props = this.props || {};
		// console.log('render:state', state)
		// console.log('render:props', props);

		if (!state.user)
      return <Loading />;
      
		// if (!!state.errors.message || !!state.data.message) 
			// this.scrollToTop();	

		return (
      <View style={[style.container]}>

        {/* 
        * KeyboardAwareScrollView - details: https://medium.freecodecamp.org/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580 
        */}
        <KeyboardAwareScrollView 
          contentContainerStyle={[style["scroll-view"], {marginBottom: 40}]}
          // keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          // alwaysBounceVertical={true}
          >

					<Message error={state.errors.message} message={state.data.message} />

					<Notice data={state.noticeMessage} />
					 
					<TextInput name="name" placeholder={Language.translate('Name')} onInput={this.saveData} value={UTILS.diacritics(state.data.name)} error={state.errors.name} showLabel={true}  />

					<PhoneInput name="phone" placeholder={Language.translate('Phone')} onInput={this.saveData} value={state.data.phone} error={state.errors.phone} showLabel={true} />

					{/* 
						Rework logic to have 3 options: Street, Apartment, Duplex (has a letter on door)  
						1 - Show the 3 options with graphics
						2 - If apt is a letter show notice to choose "Duplex", if Duplex is number do prompt "Are there more than 4 apt in this complex?", if Yes, suggest Apt"
						3 - Show Duplex Door  on for Duplex
					*/}

					<RadioBox name="addressType" labelView={
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={[style['label-medium'], style["text-color-blue"]]}>{Language.translate('Address Type')}</Text>
                <ButtonIcon 
                  onPress={() => this.setModalVisible({AddressTypeModal: true})} 
                  title={<FontAwesome name="info-circle" size={20} color={colors["territory-blue"]} />} 
                />
              </View>
            } options={[
						{label: Language.translate('House'), value: "house", active: (!state.data.isApt && !state.data.apt && !state.data.isDuplex)},
						{label: Language.translate('Apartment'), value: "apartment", active: state.data.isApt},
						{label: Language.translate('Duplex'), value: "duplex", active: (!state.data.isApt && (state.data.apt || state.data.isDuplex))}
						]} onChange={this.saveAddressType} />

          {!state.data.isNewStreet ? 
            <SelectBox 
              name="street" 
              data-name="streetId" 
              showLabel={true} 
              label={state.data.isApt ? Language.translate('Select Building') : Language.translate('Select Street')} 
              options={state.streetsList.filter(d => d.isApt === (!!state.data.isApt)).map(UTILS.mapStreets)} 
              value={{value: state.data.streetId, label: state.data.streetName}} 
              error={state.errors.streetId} 
              onInput={this.saveOptionData} 
            />
          : <TextInput name="newStreet" placeholder={state.data.isApt ? Language.translate('New Building') : Language.translate('New Street')} onInput={this.saveData} value={state.newStreetData ? state.newStreetData.street : ''} error={state.errors.newStreet} showLabel={true} />
          }  

          {!!state.data.addressId ? null :
            <ButtonLink onPress={() => {
              this.saveData({isNewStreet: !state.data.isNewStreet})
            }} customStyle={[style['add-new-street']]} textStyle={{fontSize: 18, color: (state.data.isNewStreet ? colors.red : colors.green)}}>{
              state.data.isNewStreet ? Language.translate('Cancel') :
              state.data.isApt ? Language.translate('Add New Building') : Language.translate('Add New Street')
            }</ButtonLink>
          }

					<NumberInput 
						name="address" 
						value={state.data.address} 
						error={state.errors.address} 
            showLabel={true} 
            onInput={this.saveData} 
						placeholder={state.data.isApt ? Language.translate('Apt Number') : Language.translate('House Number')} 
						/>
					
					{ (state.data.apt || state.data.isDuplex) ?
						<TextInput name="apt" placeholder={Language.translate('Duplex Door')} showLabel={true} onInput={this.saveData} value={state.data.apt} error={state.errors.apt} showLabel={true} />
					: null }

					{state.user.isManager ?
						<Switch label={Language.translate('Active')} name="inActive" onChange={this.saveData} value={!state.data.inActive} /> 
          : null }
          
          <Line />

					{/*** Include Notes fields for new Address ***/}
					{state.user.isEditor && !state.data.addressId ?
						[
						<TextInput key="note" name="note" placeholder={Language.translate('Add Notes')} onInput={this.saveData} value={state.noteData.note} error={this.state.errors.note} showLabel={true} />					
						,
            <DateInput
              key="note-date"
							placeholder={Language.translate('Date')}
							name="date"
							value={state.noteData.date}
							onChange={this.saveData} />
						]
					: null}

					{state.user.isManager && !state.data.addressId ?	
						<Switch label={Language.translate('Retain Note')} name="retain" onChange={this.saveData} value={state.noteData.retain} />
					: null }

          {/*** End Notes ***/}
          
          <View style={{ height: 60 }} />

        </KeyboardAwareScrollView>

        <Modal
          visible={this.state.AddressTypeModal}
          // style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          onCloseModal={() => {
            this.setModalVisible({AddressTypeModal: false});
          }}
          customButtons={[
            {label: 'Save Test', textStyle: {color: colors.green}},
            {label: 'Cancel', onPress: () => {
              this.setModalVisible({AddressTypeModal: false});
            }}
          ]}
					>
					<View style={{ padding: 10, }}>
            <Heading textStyle={{marginBottom: 0, marginTop: 0, borderWidth: 0, borderColor: colors.red}}>{Language.translate('Address Type')}</Heading>
            <View>
              <Text style={{flexWrap: 'wrap', fontSize: 18, margin: 10, padding: 10, color: colors["territory-blue"], backgroundColor: colors.white}}>
                {UTILS.brToLineBreaks(Language.translate('Add_New_Address_Explanation'))}
              </Text>
            </View>
					</View>
				</Modal>
        
			</View>
		);
	}
	saveOptionData = (data) => {
		let newData = {...this.state.data}; 
		if (data['data-name'])
      newData[data['data-name']] = data.option.value; // streetId
      
		if (data.option && data.option.label)
			newData.streetName = data.option.label; // streetName

		console.log('newData', newData);

		this.setState({
			data: newData,
			errors: {
				...this.state.errors,
				[data.name]: ''
			}
		});
	}
	saveAddressType = (data) => {
		if (!data) return;

		let newData;
		switch(data.option.value) {
			case 'house' :
				newData = {...this.state.data, isApt: false, apt: '', isDuplex: false};
				break;
			case 'apartment' :
				newData = {...this.state.data, isApt: true, apt: '', isDuplex: false};
				break;
			case 'duplex' :
				newData = {...this.state.data, isApt: false, isDuplex: true};
				break;
		}		
		// Check for change in Address Type
		const notice = (newData.streetName && newData.street) 
			? (newData.isApt === (!!newData.street.isAptBuilding)
				? '' : Language.translate('Changing "Address Type" will remove ') + (newData.street.isAptBuilding ? Language.translate('Building') : Language.translate('Street')))
				: '';

		// if notice, show Notice prompt. On Notice OK, save new data
		if (notice)
		return this.setState({noticeMessage: {
			title: Language.translate('Notice!'),
			message: notice,
			actions: [
				{label: Language.translate("Cancel"), action: () => this.setState({noticeMessage: null})},
				{label: Language.translate("Continue"), action: () => {
					this.setState({data: newData, noticeMessage: null})
				}, style: {float: 'right', backgroundColor: 'red', color: '#fff'}}
			]
		}})

		// Note: Update "newStreetData"
		const newStreetData = 
		(this.state.newStreetData && this.state.newStreetData.street)
		? {...this.state.newStreetData, isAptBuilding: !!newData.isApt ? 1 : 0}
		: null;

		this.setState({data: newData, newStreetData});
	}

	isNoteField(name) {
		return ['note', 'date', 'retain'].includes(name) !== false;
	}

	saveData = (data) => {
    console.log('data', data);
    let newData;

    // Get Note data
		if (this.isNoteField((Object.keys(data) || [])[0])) {
      newData = {...this.state.noteData, ...data};
	
			// Return to stop function
			return this.setState({
				noteData: newData, 
				errors: {
					note: '',
					date: '',
					message: ''
				}
			});
    }

		if ('inActive' in data) // Reverse for "inActive"
			newData = {...this.state.data, 'inActive': !data['inActive']};
		else if (this.state.data.isNewStreet && 'newStreet' in data)
			newData = {...this.state.newStreetData, street: data['newStreet'], isAptBuilding: !!this.state.data.isApt ? 1 : 0}
		else 
			newData = {...this.state.data, ...data};

		// formatPhoneNumber
		// TODO: intl phone number
		if ('phone' in data) {
			const digits = newData.phone.replace(/\D/g, '');

			if (digits.length === 10) // Allow only 10 digits
				newData.phone = UTILS.formatPhone(newData.phone);	
			
			if(digits.length > 10) // If more than 10 remove remainder
				newData.phone = UTILS.formatPhone(digits.slice(0, 10));
		}

		// format number input
		else if ('address' in  data) {
			// Remove non-digits
			const digits = newData['address'].replace(/\D/g, '') || this.state.data['address'];

			// If value is "" 
			if (!data['address']) 
				newData['address'] = ""
			else	
				newData['address'] = digits;
		}

		if ('newStreet' in data)
			this.setState({newStreetData: newData, errors: {}});
		else
			this.setState({data: newData, errors: {}});
	}

	saveAddress = (e) => {
		// console.log('this.state.data', this.state.data)
		// console.log('this.state.newStreetData', this.state.newStreetData)
		// Validate
		if (!this.state.data.address || (!this.state.data.streetId && !(this.state.newStreetData && this.state.newStreetData.street)))
			return this.setState({errors: {
				...this.state.errors,
				message: Language.translate('Enter required fields'),
				address: !this.state.data.address ? Language.translate('Enter Address') : '',
				streetId: !this.state.data.streetId ? (this.state.data.isApt ? Language.translate('Select a Building') : Language.translate('Select a Street')) : ''
			}});

		// Data
		const data = {...this.state.data, street: null, inActive: this.state.data.inActive ? true : (this.state.data.addressId ? "0" : false)}; // Api expects "0" or null for "inActive", but on create expects "false"

		if (this.state.noteData && this.state.noteData.note) {
			data.notes = [{
				"retain": !!this.state.noteData.retain,
				"note": this.state.noteData.note,
				"date": UTILS.getDateString(this.state.noteData.date)
			}];
		}

		if (this.state.newStreetData && this.state.newStreetData.street) {
			data.street = [this.state.newStreetData];
		}

		// Url
		const url = data.addressId 
		? `territories/${data.territoryId}/addresses/edit/${data.addressId}`
		: `territories/${data.territoryId}/addresses/add`;

		// save address
		Data.getApiData(url, data, 'POST')
		.then(resData => {
			console.log('then() resData', resData)
			// Clear Errors
			this.setState({
				errors: {
					address: '',
					streetId: '',
					message: ''
				}
			}, () => {
				// add new Address to list
				if (typeof this.props.navigation.getParam('addAddress') === 'function') {
					const newAddress = {...this.state.data}

					// If new Notes
					if (resData.entity_id) {
						newAddress.addressId = resData.entity_id;
						newAddress.notes = [{
							note: resData.content,
							date: resData.date,
							noteId: resData.id,
							userId: resData.user_id
						}]
					} else if (resData.id) {
						newAddress.addressId = resData.id;
					}

					// If new Street
					if (newAddress.isNewStreet && resData.street_id) {
						newAddress.streetId = resData.street_id;
						newAddress.isNewStreet = false;
						newAddress.streetName = this.state.newStreetData ? this.state.newStreetData.street : '';
						newAddress.street = {streetId: newAddress.streetId, street: newAddress.streetName, isAptBuilding: newAddress.isApt};
 
						// Note:
						// Api glitch: When notes added, "street_id" is not returned
						// Need to fix in Api
					}

					if (newAddress.isApt) {
						newAddress.building = newAddress.streetName;
						newAddress.address = 'APT ' + newAddress.address;
					}

					this.props.navigation.getParam('addAddress')(newAddress);
				} else 
				// update current Address in list
				if (typeof this.props.navigation.getParam('updateAddress') === 'function') {
					const newAddress = {...this.state.data}

					if (newAddress.isApt) {
						newAddress.building = newAddress.streetName;
						newAddress.address = 'APT ' + newAddress.address;
					}

					this.props.navigation.getParam('updateAddress')(newAddress);
			 }

			 this.props.navigation.goBack();

			})
		})
		.catch(e => {
			// console.log('error', e)
			const errorMessage = Language.translate(e || 'An error occured.');
			this.setState({errors: {
				...this.state.errors,
				message: errorMessage
			}});
		})
	}
	scrollToTop() {
		this.addressContainer && this.addressContainer.scrollIntoView()
	}
}  