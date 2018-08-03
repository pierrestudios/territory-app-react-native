import React from 'react';
import { Text, View, ScrollView } from 'react-native';

import {colors} from '../styles/main';
import Logo from '../elements/logo';
import Button from '../elements/button';

import Language from '../common/lang';
// import History from '../../common/history';
import Data from '../common/data';
import UTILS from '../common/utils';
import styles from '../styles/main';
import Loading from '../elements/loading';

/*
 * For other option for Elements:
 * https://github.com/react-native-training/react-native-elements
 * https://react-native-training.github.io/react-native-elements/docs/button.html
*/


export default class Home extends React.Component {
  static navigationOptions = {
    // title: 'Home',
    // headerTitle instead of title
    headerTitle: <Logo color={colors.white} />,
  };
  state = {
		user: null
	};
	componentWillMount() {
    this.setState({user: Data.user});
  }
  goToPage(path) {
    this.props.navigation.navigate(path)
  }
	render() {
    // {}, state
		// console.log('Data', Data);
		// console.log('render:user', this.state);
		if (!this.state.user) return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Loading />
      </View> 
    )
  
		return (  
			<ScrollView contentContainerStyle={styles["scroll-view"]}>
				{this.state.user && this.state.user.isNoteEditor ?
					[
					<Text key="territory-heading" style={[styles.heading, styles["text-center"]]}>{Language.translate('Manage Your Congregation Territory')}</Text>,
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
					] : <Text class={styles.center}>{Language.translate('You don\'t have privilege to manage territories')}</Text>
				}
      </ScrollView>
		);
	}
}