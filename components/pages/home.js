import React from 'react';
import { Text, View, ScrollView } from 'react-native';

import Logo from '../elements/Logo';
import Button from '../elements/Button';
import Heading from '../elements/Heading';
import Loading from '../elements/Loading';

import {colors} from '../styles/main';

import NavigationService from '../common/nav-service';
import Language from '../common/lang';
import Data from '../common/data';
import UTILS from '../common/utils';
import styles from '../styles/main';

export default class Home extends React.Component {
  static navigationOptions = {
    headerTitle: <Logo color={colors.white} />,
	};
  state = {
		user: null
	};
	componentWillMount() {
		// console.log('componentWillMount:user', Data.user);
		this.setState({user: Data.user});
		/*
		this.subs = [
      this.props.navigation.addListener('willFocus', () => console.log('will focus')),
      this.props.navigation.addListener('willBlur', () => console.log('will blur')),
      this.props.navigation.addListener('didFocus', () => console.log('did focus')),
      this.props.navigation.addListener('didBlur', () => console.log('did blur')),
		];
		*/
	}
	componentDidMount() {
		// console.log('componentDidMount:user', Data.user);
		this.props.navigation.addListener('willFocus', () => {
			if (!this.state.user)
				this.setState({user: Data.user});
		});
		NavigationService.setNavigator(this.props.navigation);

		if (!Data.user)
			Data.reLogin();
  }
  goToPage(path) {
    NavigationService.navigate(path)
  }
	render() {
    // {}, state
		// console.log('Data', Data);
		console.log('render:state', this.state);
		if (!this.state.user) return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Loading />
      </View> 
    )
  
		return (  
			<ScrollView contentContainerStyle={styles["scroll-view"]}>
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
      </ScrollView>
		);
	}
}