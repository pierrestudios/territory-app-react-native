import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';

import {Link, ButtonLink} from '../elements/Button';
import Strong from '../elements/Strong';

import style, { colors } from '../styles/main';


export default class TerritoryFn {
	/*
  static getStreetsList(data) {
    console.log('data.addresses.length', data.addresses.length)
		if (!data.addresses || !data.addresses.length) return;

		return UTILS.getStreetsList(data.addresses);	
	}
	static sortAddresses(addresses) {
		return addresses
		.sort(UTILS.sortAddress) 
	}
	*/
	static getListingAddress(list) {
		return UTILS.getListingAddress(list);	
	}
	static getListings(data = [], caller, user, callerName) {
		const getListClass = (data, itemClass) => (
      null
      // classNames((data.inActive ? style.inactive : ''), style[itemClass])
			// checkIfDoNotCall -> TODO
		)
		const getActionButtons = list => (
			user.isEditor ? <Link class={style.delete} onClick={(e) => this.notifyDelete(e, list, caller, user, callerName)}>{Language.translate('Delete')}</Link> : null
    )
    /*
		return this.sortAddresses(data.addresses)
			.map(list => (
				list.inActive && !user.isManager ? <li class={style.hidden}></li> :
				<SwipeList swipeLeft={() => console.log('swipeLeft')} swipeRight={() => console.log('swipeRight')} class={style.addresses}>
					<Link onClick={(e) => caller.viewNotes(list)} class={getListClass(list, 'notes-col')}>
						{list.notes && list.notes.length ? [
							<span class={style['listings-notes-action']}>{getActionButtons(list)}</span>,
							<span class={style['listings-notes-date']}>
								{list.notes[0].date}
							</span>,
							<span class={style['listings-notes']}>
								{UTILS.diacritics(list.notes[0].note)}
							</span>
						] : [
							<span class={style['listings-notes-action']}>{getActionButtons(list)}</span>,
							<span class={classNames(style['add-notes'])}>{'Add Notes'}</span>
						]}
					</Link>
					<Link onClick={(e) => user.isEditor ? caller.viewAddress(list) : console.log('Not Editor')} class={getListClass(list, 'address-col')}>
						<span class={style['listings-address-name']}>{UTILS.diacritics(list.name)}</span> 
						<span class={style['listings-address']}>
							{this.getListingAddress(list)}
						</span>
					</Link>
				</SwipeList>
			));

    */ 


    return (
      <FlatList
				contentContainerStyle={style.listings}
				data={data.addresses.sort(UTILS.sortAddress)}
				keyExtractor={(item) => item.addressId.toString()}
				renderItem={({item}) => (
					<Swipeout key={item.addressId} right={[
						{
							text: Language.translate('Notes'), type: 'primary', onPress: () => console.log('Notes onPress') // caller.viewNotes(list) 
						}, 
						user.isEditor ? {
							text: Language.translate('Delete'), type: 'delete', onPress: () => this.notifyDelete(e='', item, caller, user, callerName) // backgroundColor: colors.red
						} : { text: ''}
					]} autoClose={true} close={true}>
					<View style={[style['listings-item']]}>
            <TouchableOpacity style={style['listings-notes']} onPress={() => user.isNoteEditor ? caller.viewNotes(item) : console.log('Not Note Editor')}>
              {item.notes && item.notes.length ? [
                <Text key="listings-date" style={[style['listings-date-text'], style['listings-notes-date-text']]}>
                  {item.notes[0].date}
                </Text>,
                <Text key="listings-notes" numberOfLines={1} style={style['listings-notes-note-text']}>
                  {UTILS.diacritics(item.notes[0].note)}
                </Text>
              ] : [
                <ButtonLink key="listings-add-notes" customStyle={[style['add-notes']]}>{Language.translate('Add Notes')}</ButtonLink>
              ]}
            </TouchableOpacity>	
            <TouchableOpacity style={[style['listings-name'], style['address-listings-name']]} onPress={() => user.isEditor ? caller.viewAddress(item) : console.log('Not Editor')}>
              <Text numberOfLines={1} style={[style['listings-name-text'], style['listings-address-name']]}>{UTILS.diacritics(item.name)} </Text>
              <Text numberOfLines={1} style={style['listings-address']}>
							  {this.getListingAddress(item)}
						  </Text>
						</TouchableOpacity>
						<View style={{position: 'absolute', width: 10, height: '100%', top: 15, right: 5}}>
							<Ionicons name="ios-arrow-forward" size={24} color={colors["grey-lite"]} />
						</View>
					</View>
					</Swipeout>
				)}
			/>
    )  
	}
	static notifyDelete = (e, list, caller, user, callerName) => {
		// e.stopPropagation();

		console.log('notifyDelete'); return;

		const messageBlock = <div>
			<p>{Language.translate('Delete_Address_Sure')}</p>
			<p><strong>{list.name}</strong> {this.getListingAddress(list)}</p>
		</div>

		caller.setState({
			noticeMessage: {
				title: Language.translate('Remove Address'),
				description: messageBlock,
				inputs: [
					{label: Language.translate("Reason"), type: 'TextInput', name: 'note', required: true},
					{label: Language.translate("Remove Completely"), name: 'delete', type: user.isManager ? 'Switch' : ''},
				],
				actions: [
					{label: Language.translate("Cancel"), action: () => caller.setState({noticeMessage: null, shouldRender: 'Territory'})},
					{label: Language.translate("Continue"), action: () => {
						const errors = caller.state.noticeMessage.inputs.filter(d => (
							d.required && !d.value
						));
						
						console.log('errors', errors);

						if (errors.length) {
							const newData = caller.state.noticeMessage.inputs.map(d => (
								d.required && !d.value ? {...d, error: d.name === 'note' ? Language.translate('Enter your reason for removing address') : d.name + ' is required'} : d
							));
			
							caller.setState({noticeMessage: {
								...caller.state.noticeMessage,
								inputs: newData
							}, shouldRender: 'Modal'}, () => console.log('state', caller.state));

							return;
						}

						let postData = {};
						caller.state.noticeMessage.inputs.forEach(d => {
							postData[d.name] = d.value;
						})

						console.log('postData', postData);
						
						// Delete address
						Data.getApiData(`addresses/remove/${list.addressId}`, {delete: postData.delete, note: postData.note}, 'POST')
						.then(data => {
							console.log('then() data', data)
							
							if (!data) {
								return caller.setState({noticeMessage: {
									...caller.state.noticeMessage,
									errorMesage: 'An error occured: ' + e
								}, shouldRender: 'Modal'});
							}

              // if Territory
							if (caller && callerName === 'Territory') {
								if (caller.updateAddress && typeof caller.updateAddress === 'function') {
									caller.updateAddress({...list, inActive: !postData.delete}, postData.delete, false);
									// NOTE: "Reason" note not included in Address.notes
								}
              }
              
              // if Notes || Address
              else if (caller && (callerName === 'Notes' || callerName === 'Address')) {
								if (caller.props.updateAddress && typeof caller.props.updateAddress === 'function') {
									caller.props.updateAddress({...list, inActive: !postData.delete}, postData.delete);
								}
							}
						})
						.catch(e => {
							caller.setState({noticeMessage: {
								...caller.state.noticeMessage,
								errorMesage: 'An error occured: ' + e
							}, shouldRender: 'Modal'});
						});
						
					}, style: {float: 'right', backgroundColor: 'red', color: '#fff'}}
				],
				saveData: (e) => {
					// console.log('e', e);

					const newData = caller.state.noticeMessage.inputs.map(d => {
						if (d.name === e.target.name) return {
							...d,
							value: (e.type === 'click') ? e.target.checked : e.target.value,
							error: ''
						}
						return d;
					});
	
					caller.setState({noticeMessage: {
						...caller.state.noticeMessage,
						inputs: newData,
						errorMesage: ''
					}, shouldRender: 'Modal'});
				}
			},
			shouldRender: 'Territory'
		});
	}
}