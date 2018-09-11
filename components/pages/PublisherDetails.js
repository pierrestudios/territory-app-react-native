import React from 'react';
import { Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';

import Language from '../common/lang';
import UTILS from '../common/utils';
import NavigationService from '../common/nav-service';

import Heading from '../elements/Heading';
import {Link, ButtonLink} from '../elements/Button';

import styles, { colors } from '../styles/main';

export default class PublisherDetails extends React.Component {
  static navigationOptions = {
    ...UTILS.headerNavOptionsDefault,
		headerRight: (<View />), // To center on Andriod
    title: Language.translate('Publisher Details'),
  };
	componentWillMount() {
		const {navigation} = this.props;
    const data = navigation.getParam('data');
    if (!!data) {
      this.setState({data});
    }
	}
	getListings(data = []) {
    return (
      <FlatList
				contentContainerStyle={styles.listings}
				data={data.sort(UTILS.sortTerritory)}
				keyExtractor={(item) => item.territoryId.toString()}
				renderItem={({item}) => (
          <TouchableOpacity style={styles['listings-item']} onPress={() => this.viewDetails(item)}>
            <View style={styles['listings-number']}>
              <Text style={styles['listings-number-text']}>{item.number}</Text>
						</View>
						<View style={[styles['listings-date'], {left: 60}]}>
							<Text style={[styles['listings-date-text'], (this.getDateStatusColor(item.date))]}>{item.date}</Text>
						</View>
						<View style={styles['listings-delete']}>
							<ButtonLink onPress={() => this.editPublisher(state.data)} customStyle={[styles["heading-button-link"], {borderColor: colors["grey-lite"], borderWidth: 1, backgroundColor: colors.white}]} textStyle={[styles["heading-button-link-text"], {color: colors.red}]}> {Language.translate('Unassign Territory')} </ButtonLink>
						</View>
					</TouchableOpacity>
				)}
			/>
    )  
	}
	getDateStatusColor(date) {
		return UTILS.isPassedDueDate(date) ? {color: colors.red} : null;
	}
	viewDetails(data) {
    NavigationService.navigate('TerritoryDetails', {territoryId: data.territoryId, allTerritories: false})
	}
	editPublisher(data) {
		NavigationService.navigate('PublisherEdit', {data, updatePublisher: (newPublisher) => {
			if (typeof this.props.navigation.getParam('updatePublisher') === 'function') {
        this.props.navigation.getParam('updatePublisher')(newPublisher);
			}
			this.setState({data: newPublisher});
		}});
	}
	render() {
    const state = this.state || {};
    const props = this.props || {};
    // console.log('Territories:render:props', props)
    // console.log('Territories:render:state', state)

		const listings = state.data.territories && state.data.territories.length ? this.getListings(state.data.territories) : <Heading>{Language.translate('Publisher has no territories')}</Heading>;

		return (
      <View style={[styles.section, styles.content]}>
				<View style={[styles['territory-heading']]}>
					<Text style={[styles['heading-name'], styles['heading-publisher-name']]}>{state.data.firstName} {state.data.lastName}</Text>
          <ButtonLink onPress={() => this.editPublisher(state.data)} customStyle={[styles["heading-button-link"], {backgroundColor: colors["territory-blue"]}]} textStyle={styles["heading-button-link-text"]} textColorWhite> {Language.translate('Edit Publisher')} </ButtonLink>
				</View>  
				<View style={[styles['territory-heading'], {height: 40, paddingTop: 5, borderColor: colors.red, borderWidth: 0}]}>
					<ButtonLink onPress={this.assignTerritory} customStyle={[styles["heading-button-link"], {backgroundColor: colors.green}]} textStyle={styles["heading-button-link-text"]} textColorWhite> {Language.translate('Assign Territory')} </ButtonLink>
				</View>	
				<View style={[styles.section, styles['listings-results'], styles['listings-results-address']]}>
          {listings}
				</View>
			</View>
    );
    
  }
}