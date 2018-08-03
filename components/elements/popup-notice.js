import React from 'react';
import { Text, View, Button } from 'react-native';

// import FaAlert from 'preact-icons/lib/fa/exclamation-circle';
// import Heading from '../Heading';
// import {ALink} from '../Button';
import TextInput from '../TextInput';
import Switch from '../Switch';
import SelectBox from '../SelectBox';
import RadioBox from '../RadioBox';
import DateInput from '../DateInput';
import Message from '../FormMessage';

import style from './style.less';

export default class PopupNotice extends Component {
	componentWillMount() {
		this.state = {
			SoftKeyBoard: false,
			openedDropDown: null
		}
	}
	render(props, state) {
		// console.log('state', state)
		const data = props.data;
		if (!data) return;

		// console.log('data', data);

		const icon = props.showIcon ? <FaAlert size={20} />  : null;
		const classes = classNames(style.input, style['with-icon']);
		const activeOptClass = classNames(style['input-options'], style['input-options-active']); 
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
					console.log('a', a);
					a.removePlaceholder = true;
					switch(a.type) {
						case 'TextInput':
						return <TextInput {...a} type="text" showLabel={true} onInput={saveData} onFocus={onFocus} onBlur={onBlur} />
						case 'Switch':
						return <Switch {...a} onChange={saveData} />
						case 'RadioBox':
						return <RadioBox {...a} onChange={saveData} />
						case 'SelectBox':
						return <SelectBox {...a} showLabel={true} onInput={saveData} showDropDown={showDropDown} />
						case 'DateInput':
						return <DateInput {...a} showLabel={true} onChange={saveData} />
						
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
					<ALink onClick={a.action} style={a.style}>{a.label}</ALink>
				))
			}
		}
		const showDropDown = (e, hide = false) => {
			if (window.innerHeight < (minWindowHeight + 400)) {
				this.setState({openedDropDown: hide ? null : e.target});
			}
		}
		return (
			<div>
				<div class={style['notice-box-container']}>
					<div class={style['notice-box']} style={getCustomStyle('notice-box')}>
						<Heading level={3} customClass={style['notice-box-title']}>
							{icon}
							<span>{data.title || 'Notice!'}</span>
						</Heading>
						<label class={style['notice-box-message']}>{data.description}</label>
						<Message error={data.errorMesage} message={data.message} />
						{data.inputs ? 
							<div class={classNames(style.line, style['widescreen'])} />
						: null}
						<div class={style['notice-box-inputs']}>
							{getInputs(data)}
						</div>
						{data.actions ? 
						<div class={classNames(style.line, style['widescreen'])} />
						: null }
						<div class={style['notice-box-actions']}>
							{getActions(data)}
						</div>	
					</div>
				</div>
			</div>	
		);
	}
}