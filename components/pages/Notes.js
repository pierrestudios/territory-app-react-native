import React from 'react';
import { FlatList, Text, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';

import Heading, { HeadingBlue } from '../elements/Heading';
import Loading from '../elements/Loading';
import Message from '../elements/Message';
import Line from '../elements/Line';
import {Link, ButtonLink, Button, ButtonIcon, ButtonHeader} from '../elements/Button';
import Notice from '../elements/PopupNotice';
import {TextInput, NumberInput, PhoneInput, DateInput, RadioBox, Switch, SelectBox} from '../elements/FormInput';
import Modal from '../elements/Modal';

import style, { colors } from '../styles/main';

export default class Notes extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate('Notes'),
      headerRight: (
				<ButtonHeader
					onPress={() => {navigation.setParams({saveNotes: true})}}
					title="Save"
					color="#fff"
        />
			),
    }
  }

  notesContainer = null
	state = {
		noteData: {
			note: '',
			date: UTILS.getToday(),
		},
		errors: {
			note: '',
			date: '',
			message: ''
		},
		user: null
	}
	componentWillMount() {
    const {navigation} = this.props;
		if (navigation.getParam('addressActive')) {
			this.setState({
				data: navigation.getParam('addressActive'),
				user: Data.user
			});
		}
	}
	componentDidMount() {
		// this.notesContainer && this.notesContainer.scrollIntoView()
	}
	render() {
    const state = this.state || {};
    const props = this.props || {};
	  // console.log('state', state)
		if (!state.data)
      return <Loading />;
      
    const notes = (
			<FlatList
				contentContainerStyle={style.listings}
        data={state.data.notes}
        extraData={this.state}
				keyExtractor={(item) => item.noteId.toString()}
				renderItem={({item}) => (
          <View style={[style['listings-item'], (item.noteId === state.noteData.noteId ? style['listings-item-active'] : null)]}>
            {state.user.isManager || state.user.userId === item.userId ?
              <ButtonLink customStyle={[style['listings-notes'], style['listings-notes-edit']]} onPress={() => this.editNotes(item)}>
                {Language.translate('Edit')} 
              </ButtonLink>	
            : null}
            <View style={[style['listings-name'], style['address-listings-name']]}>
              <Text style={[style['listings-date-text'], style['listings-notes-date-text']]}>
                {item.date}
              </Text>
              <Text numberOfLines={1} style={style['listings-notes-note-text']}>
                {UTILS.diacritics(item.note)}
              </Text>
            </View>
          </View>
				)}
			/>
		);

		return (
      <View style={[style.container]}>
        <KeyboardAwareScrollView 
          contentContainerStyle={[style["scroll-view"], {marginBottom: 40}]}
          keyboardDismissMode="interactive"
          >
          <HeadingBlue>
            {state.noteData && state.noteData.noteId ? Language.translate('Update Notes') : Language.translate('Add Notes')}
          </HeadingBlue>

          <Text style={[style["text-strong"], {padding: 5, minHeight: 50}]}>
            {state.data.name ? UTILS.diacritics(state.data.name) + ' - ' : ''} {UTILS.getListingAddress(state.data)}
          </Text>

          <View style={[style.content, style['notes-content'], {padding: 5, minHeight: 250}]}>
            <Message error={state.errors.message} message={state.data.message} />
  
            <TextInput name="note" placeholder={Language.translate('Add Notes')} onInput={this.saveData} value={this.state.noteData.note} error={this.state.errors.note} />					

            <DateInput
              key="note-date"
							placeholder={Language.translate('Date')}
							name="date"
							value={state.noteData.date}
							onChange={this.saveData} />  
              
            {state.user.isManager ?	
            <Switch label={Language.translate('Retain Note')} name="retain" onChange={this.saveData} value={this.state.noteData.retain}/>
            : null }
            
            {/* saveNotes */}
            
          </View>

          <View class={style['notes-results']}>
            <Heading level={3}>{Language.translate('Previous Notes')}</Heading>
            {notes}
          </View>

          <Line />

          <Notice data={state.noticeMessage} />
 
        </KeyboardAwareScrollView>
      </View>
		);
	}
	saveData = (e) => {
		console.log('e', e);
		let newData;
		if (!!e.detail && !!e.detail.option) {
			newData = {...this.state.noteData, date: e.detail.option}
		} else if (e.type === 'click') 
			newData = {...this.state.noteData, [e.target.name]: e.target.checked};
		else
		newData = {...this.state.noteData, [e.target.name]: e.target.value};

		this.setState({
			noteData: newData, 
			errors: {
				note: '',
				date: '',
				message: ''
			}
		});
  }
  /*
	getNotes(data = {}) {
		return data.notes && data.notes
			.map(note => (
				this.state.user.isManager || this.state.user.userId === note.userId ? 
				<li class={note.noteId ===  this.state.noteData.noteId ? style.active : ''}>
					<Link onClick={(e) => this.editNotes(note)}>
						<span class={style['listings-notes-edit']}><IconEdit size={20} /></span>
						<span class={style['listings-notes-date']}>{note.date}</span>
						<span class={style['listings-notes-note']}>{UTILS.diacritics(note.note)}</span> 
					</Link>
				</li>
				: 
				<li>
					<Link>
						<span class={style['listings-notes-edit']}></span>
						<span class={style['listings-notes-date']}>{note.date}</span>
						<span class={style['listings-notes-note']}>{UTILS.diacritics(note.note)}</span> 
					</Link>
				</li>
			));
  }
  */
	editNotes(data) {
		console.log('editNotes', data);
		this.setState({noteData: {
			note: UTILS.diacritics(data.note),
			date: UTILS.getDateObject(data.date),
			retain: data.retain || false,
			noteId: data.noteId
		}})
	}
	saveNotes = (e) => {
		e.preventDefault();
		// console.log('noteData', this.state.noteData);
		// console.log('this.state.data', this.state.data)
		// Validate
		if (!this.state.noteData.note || !this.state.noteData.date)
			return this.setState({errors: {
				...this.state.errors,
				note: !this.state.data.note ? Language.translate('Notes is empty') : '',
				date: !this.state.data.date ? Language.translate('Date is missing') : ''
			}});

		// Data
		const data = {...this.state.noteData, date: UTILS.getDateString(this.state.noteData.date)};		

		// Url
		const url = this.state.noteData.noteId 
		? `territories/${this.state.data.territoryId}/notes/edit/${this.state.noteData.noteId}`
		: `territories/${this.state.data.territoryId}/addresses/${this.state.data.addressId}/notes/add`;

		// save note
		Data.getApiData(url, data, 'POST')
		.then(resData => {
			// console.log('then() resData', resData)
			// Clear Errors
			this.setState({
				errors: {
					note: '',
					date: '',
					message: ''
				}
			}, () => {
				// console.log('this.state', this.state)
				// update current Address
				if (this.props.updateAddress && typeof this.props.updateAddress === 'function') {
					let newNotes;
					// editting notes?
					if (this.state.noteData.noteId && resData) {
						newNotes = this.state.data.notes.map(n => {
							if (n.noteId === this.state.noteData.noteId)
								return {...n, date: data.date, note: data.note, retain: data.retain};
							return n;
						})
						.sort(UTILS.sortNotes);
					} 
					// adding new notes?
					else {
						newNotes = (this.state.data.notes && this.state.data.notes.slice(0) || []);
						newNotes.push({
							note: resData.content,
							date: resData.date,
							noteId: resData.id,
							retain: resData.archived === 1,
							userId: resData.user_id
						});
						newNotes = newNotes.sort(UTILS.sortNotes);
					}
					const newAddress = {...this.state.data, notes: newNotes}
					this.props.updateAddress(newAddress);
				}
			})
		})
		.catch(e => {
			// console.log('error', e)
			const errorMessage = Language.translate('An error occured.');
			this.setState({errors: {
				...this.state.errors,
				message: errorMessage
			}});
		})
	}
}