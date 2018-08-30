import React from 'react';
import { Text, View, ScrollView, TouchableHighlight, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome, EvilIcons, Feather } from '@expo/vector-icons';

import Logo from '../elements/Logo';
import {Button, ButtonLink, Link, ButtonHeader} from '../elements/Button';
import Heading from '../elements/Heading';
import Loading from '../elements/Loading';
import Modal from '../elements/Modal';

import NavigationService from '../common/nav-service';
import Language from '../common/lang';
import Data from '../common/data';
import UTILS from '../common/utils';
import styles, {colors} from '../styles/main';

export default class Home extends React.Component {
  static navigationOptions = ({navigation}) => {
		return {
			headerTitle: <Logo />,
			headerLeft: (<View />), // To center on Andriod
			headerRight: (
				<ButtonHeader
					onPress={() => {navigation.setParams({openUserInfo: !navigation.getParam('openUserInfo'), headerTriggered: true})}}
					title={<FontAwesome name="user-circle" size={20} color="#fff" />}
					color="#fff"
				/>
			),
		}
	};
  state = {
		user: null,
		drawerOpened: false,
		modalVisible: false
	}; 
	componentWillMount() {
		NavigationService.setNavigator(this.props.navigation);

		const user = Data.user;

		if (!user || !user.token) {
			Data.loadSavedUser()
				.then(user => {
					this.setState({user});
					// console.log('componentWillMount:loadSavedUser.user', user);
				})
				.catch(UTILS.logError)
		} else {
			this.setState({user});
			// console.log('componentWillMount:Data.user', user);
		}
	}
	componentDidMount() {
		this.props.navigation.addListener('willFocus', () => {
			// console.log('willFocus:state.user', this.state.user)
			// console.log('willFocus:Data.user', Data.user)
			if (!this.state.user || !this.state.user.token)
				this.setState({user: Data.user});
		});
	}
	componentWillReceiveProps(props) {
		// console.log('props', props);
		if (props.navigation && !!props.navigation.getParam('headerTriggered')) {
			this.setModalVisible(props.navigation.getParam('openUserInfo'))
		}
	}
  setModalVisible(visible) {
    this.setState({modalVisible: visible}, () => this.props.navigation.setParams({openUserInfo: visible, headerTriggered: false})) // Bug: causes crash
  }
  goToPage(path) {
    NavigationService.navigate(path)
	}
	sendLogout() {
		this.setState({
			user: null,
			modalVisible: false
		}, () => {
			Data.reLogin();
		});
	}
	render() {
		// console.log('Home:render:state', this.state);
		if (!this.state.user) return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Loading />
      </View> 
		)

		return ( 
			<SafeAreaView style={[ { backgroundColor: '#ecf0f1' }]}>
        <StatusBar
          barStyle="light-content"
				/>

				<ScrollView contentContainerStyle={styles["scroll-view"]} key="home-page">
					{this.state.user && this.state.user.isNoteEditor ?
						[
						<Heading key="territory-heading">{Language.translate('Manage Your Congregation Territory')}</Heading>,
						<View key="menu-nav" style={styles["main-menu"]}>
							{this.state.user.isAdmin ? <Button disabled key="users" onPress={() => this.goToPage("Users")} title={Language.translate('Users')} /> : null}
							{this.state.user.isManager ? [
								<Button disabled key="publishers" onPress={() => this.goToPage("Publishers")} title={Language.translate('Publishers')} />,
								<Button disabled key="boundaries" onPress={() => UTILS.openFrameUrl('boundaries')} title={Language.translate('Territory Map')} />,
								<Button disabled key="s-13" onPress={() => UTILS.openFrameUrl('s-13')} title={Language.translate('Print_S-13', 'Print S-13 Form')} />,
								<Button key="territories-all" onPress={() => this.goToPage("Territories-all")} title={Language.translate('All Territories')} />
							]: null}
							<Button key="territories" onPress={() => this.goToPage("Territories")} title={Language.translate('My Territories')} /> 
						</View>
						] : <Heading>{Language.translate('You don\'t have privilege to manage territories')}</Heading>
					}
				</ScrollView>
				
				<Modal
					animationType="fade"
					visible={this.state.modalVisible}
					onCloseModal={() => {
						this.setModalVisible(!this.state.modalVisible);
					}}
					>
					<View style={styles["modal-view"]}>
						<Heading textStyle={{marginBottom: 20, marginTop: 0}}>{Language.translate('My User Account')}</Heading>

						<ButtonLink
							customStyle={[styles["heading-button-link"], {width: 100, alignSelf: 'center', padding: 15, borderColor: colors["grey-lite"], borderWidth: 1}]}
							// textStyle={[styles["heading-button-link-text"],{borderColor: colors["red"], borderWidth: 1}]}
							onPress={() => {
								this.sendLogout();
							}}>{Language.translate('Sign Out')} 
						</ButtonLink>

					</View>
				</Modal>

			</SafeAreaView>
		)
	}
}