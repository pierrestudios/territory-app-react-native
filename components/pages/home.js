import React from 'react';
import { Text, View, ScrollView, Modal, TouchableHighlight } from 'react-native';

import Logo from '../elements/Logo';
import Button, {Link} from '../elements/Button';
import Heading from '../elements/Heading';
import Loading from '../elements/Loading';

import {colors} from '../styles/main';

import NavigationService from '../common/nav-service';
import Language from '../common/lang';
import Data from '../common/data';
import UTILS from '../common/utils';
import styles from '../styles/main';

export default class Home extends React.Component {
  static navigationOptions = ({navigation}) => {
		// const params = navigation.state.params || {};
		// console.log('params', params);
		return {
			headerTitle: <Logo color={colors.white} />,
			headerRight: (
				<Button
					onPress={() => {navigation.setParams({openDrawer: true})}}
					title="Info"
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
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
	componentWillMount() {
		this.setState({user: Data.user});
	}
	componentDidMount() {
		this.props.navigation.addListener('willFocus', () => {
			if (!this.state.user || !this.state.user.token)
				this.setState({user: Data.user});
		});
		NavigationService.setNavigator(this.props.navigation);

		if (!Data.user || !Data.user.token)
			Data.reLogin();
	}
	componentWillReceiveProps(props) {
		// console.log('props', props);
		if (props.navigation && props.navigation.state && props.navigation.state.params) {
			this.setModalVisible(!!props.navigation.state.params.openDrawer)
		}
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
			[
			<ScrollView contentContainerStyle={styles["scroll-view"]} key="home-page">
				{this.state.user && this.state.user.isNoteEditor ?
					[
					<Heading key="territory-heading">{Language.translate('Manage Your Congregation Territory')}</Heading>,
					<View key="menu-nav" style={styles["main-menu"]}>
						{this.state.user.isAdmin ? <Button key="users" onPress={() => this.goToPage("Users")} title={Language.translate('Users')} /> : null}
						{this.state.user.isManager ? [
							<Button key="publishers" onPress={() => this.goToPage("Publishers")} title={Language.translate('Publishers')} />,
							<Button key="boundaries" onPress={() => UTILS.openFrameUrl('boundaries')} title={Language.translate('Territory Map')} />,
							<Button disabled key="s-13" onPress={() => UTILS.openFrameUrl('s-13')} title={Language.translate('Print_S-13', 'Print S-13 Form')} />,
							<Button customStyle={{backgroundColor: 'red'}} key="territories-all" onPress={() => this.goToPage("Territories-all")} title={Language.translate('All Territories')} />
						]: null}
						<Button key="territories" onPress={() => this.goToPage("Territories")} title={Language.translate('My Territories')} /> 
					</View>
					] : <Heading>{Language.translate('You don\'t have privilege to manage territories')}</Heading>
				}
			</ScrollView>,
			
			<Modal
				key="user-info"
				// animationType="fade"
				transparent={true}
				visible={this.state.modalVisible}
				// presentationStyle={'overFullScreen'}
				onRequestClose={() => {
					// alert('Modal has been closed.');
				}}
				style={{flex: 1, alignItems: 'center', justifyContent: 'center', shadowRadius: 5, shadowOpacity: .5}}
				>
				<View style={{marginTop: 63, backgroundColor: colors.white, padding: 20}}>
					<View>
						<Heading>{Language.translate('My User Account')}</Heading>

						<Link
							onPress={() => {
								this.sendLogout();
							}}>
							<Text>{Language.translate('Sign Out')}</Text>
						</Link>

						<TouchableHighlight
							onPress={() => {
								this.setModalVisible(!this.state.modalVisible);
							}}>
							<Text>{Language.translate('Close')}</Text>
						</TouchableHighlight>
					</View>
				</View>
			</Modal>
			]
		);
	}
}