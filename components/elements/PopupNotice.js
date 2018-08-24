import React from 'react';
import {TouchableHighlight, View, Text} from 'react-native';

import {Link} from './Button';
import {TextInput, DateInput, SelectBox, RadioBox, Switch} from './FormInput';
import Message from './Message';
import Modal from './Modal';
import Heading, {HeadingBlue} from './Heading';
import Line from './Line';

import style, { colors } from '../styles/main.js';

export default class PopupNotice extends React.Component {
  closePopup() {
    typeof this.props.closeNotice === 'function' && this.props.closeNotice();
  }

  render() {
		const props = this.props;
		const data = props.data;

		// !!this.props.data determines if Notice is displayed
		if (!data) 
			return null;

		// console.log('data', data);
		// console.log('state', this.state);

		const icon = null;//props.showIcon ? <FaAlert size={20} />  : null;
		// const classes = classNames(style.input, style['with-icon']);
		// const activeOptClass = classNames(style['input-options'], style['input-options-active']); 
		const inputsData = {};
		const inputsError = {};
		const minWindowHeight = 400;
		const getInputTopPosition = (el, isDropDown = false) => {
			// console.log('el', el);
			const pos = getOffsetPosition(el);
			// console.log('el.pos', pos);
			// console.log('el.offsetTop', el.offsetTop);
			// console.log('el.offsetHeight', el.offsetHeight);
			// console.log('window.innerHeight', window.innerHeight);
			// (minWindowHeight - (window.innerHeight + el.offsetTop + el.clientHeight)) + 'px'
			// window.innerHeight  >(window.innerHeight - el.offsetTop) + 'px'
			return (
				isDropDown 
				? window.innerHeight - (pos.offsetTop + el.offsetHeight + 200) + 'px' // 200 (300 "dropdown height" - 100 "original top position")
				: window.innerHeight - (pos.offsetTop - 50) + 'px'
			)
		}
		const getOffsetPosition = ( elem ) => {
				var position = {offsetLeft: 0, offsetTop: 0};
				do {
					if ( !isNaN( elem.offsetLeft ) )
					{
						position.offsetLeft += elem.offsetLeft;
					}
					if ( !isNaN( elem.offsetTop ) )
					{
						position.offsetTop += elem.offsetTop;
					}
				} while( elem = elem.offsetParent );
				return position;
		}
		const onFocus = (e) => {
			setTimeout(() => {
				if (window.innerHeight < minWindowHeight)
					this.setState({SoftKeyBoard: true});
			}, 1000);
		}
		const onBlur = () => {
			this.setState({SoftKeyBoard: false});
		}
		const getCustomStyle = (name) => {
			switch(name) {
				case 'notice-box' :
					return this.state.SoftKeyBoard ? {
						top: document.activeElement ? getInputTopPosition(document.activeElement) : '100px'
					} : this.state.openedDropDown ? 
					{
						top: getInputTopPosition(this.state.openedDropDown, true) 
					} : null;
				default :
					return;
			}
		}
		const getInputs = (data) => {
			if (data.inputs) {
				return data.inputs.map(a => {
					// console.log('a', a);
					a.removePlaceholder = true;
					switch(a.type) {
						case 'TextInput':
						return <TextInput {...a} key={`${a.name}-key`} type="text" showLabel={true} onInput={saveData} onFocus={onFocus} onBlur={onBlur} />
						case 'Switch':
						return <Switch {...a} key={`${a.name}-key`} onChange={saveData} />
						case 'RadioBox':
						return <RadioBox {...a} key={`${a.name}-key`} onChange={saveData} />
						case 'SelectBox':
						return <SelectBox {...a} key={`${a.name}-key`} showLabel={true} onInput={saveData} showDropDown={showDropDown} />
						case 'DateInput':
						return <DateInput {...a} key={`${a.name}-key`} showLabel={true} onChange={saveData} />
						
						default:
						return;
					}
				})
			}
		}
		const saveData = (e) => {
			if ( typeof data.saveData === 'function')
				data.saveData(e);
		}
		const getActions = (data) => {
			if (data.actions) {
				return data.actions.map(a => (
					<Link key={`${a.label}-key`} onClick={a.action} style={a.style}>{a.label}</Link>
				))
			}
		}
		const getCustomButtons = (data) => {
			if (data.actions) {
				return data.actions.map(a => (
					{label: a.label, onPress: a.action, buttonStyle: a.style, textStyle: a.textStyle}
				))
			}
		}
		const showDropDown = (e, hide = false) => {
			if (window.innerHeight < (minWindowHeight + 400)) {
				this.setState({openedDropDown: hide ? null : e.target});
			}
		}

    return (
			<Modal
				animationType="fade"
				visible={true}
				onCloseModal={() => {
					this.closePopup();
				}}
				customButtons={getCustomButtons(data)}
				>
				<View style={styles["modal-view"]}>
				
					<HeadingBlue>
						{icon}
						{data.title || 'Notice!'}
					</HeadingBlue>
					
					<View style={styles['notice-box-message']}>{data.description}</View>
					
					<Message error={data.errorMesage} message={data.message} />
					{data.inputs ? 
						<Line />
					: null}
					<View style={styles['notice-box-inputs']}>
						{getInputs(data)}
					</View>
						
				</View>
			</Modal>

		);
  }
}