import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Data from '../common/data';
import Language from '../common/lang';
import UTILS from '../common/utils';

import Loading from '../elements/Loading';
import Message from '../elements/Message';
import {ButtonHeader, ButtonLink, Button} from '../elements/Button';
import {SelectBox} from '../elements/FormInput';
import Line from '../elements/Line';
import ListTerritories from '../elements/ListTerritories';

import style, { colors } from '../styles/main';

export default class PublisherAssignTerritory extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate('Assign Territory'),
      headerRight: (<View />), // To center on Andriod
    }
  }
  state = {
    data: null,
    availableTerritories: null,
    newTerritory: null,
    errors: {
      newTerritory: '',
      message: ''
    }
  }
	componentWillReceiveProps(props) {
		if (props.navigation) {			
			if (!!props.navigation.getParam('savePublisher'))
				this.savePublisher();
		}
	}
	componentWillMount() {
    const {navigation} = this.props;
    const data = navigation.getParam('data');
    const availableTerritories = navigation.getParam('availableTerritories');
    if (!!data && !!availableTerritories) {
      this.setState({data, availableTerritories});
    }
	}
	render() {
    const state = this.state || {};
    const props = this.props || {};
		// console.log('render:state', state)
		// console.log('render:props', props);

		if (!state.data || !state.availableTerritories)
      return <Loading />;

    const listings = state.data.territories && state.data.territories.length 
      ? <ListTerritories 
        data={state.data} 
        updatePublisherAfterRemoveTerritory={this.updatePublisherAfterRemoveTerritory} 
        /> 
      : <Heading>{Language.translate('Publisher has no territories')}</Heading>;

    return (
      <View 
        style={[styles.section, styles.content, {
          borderColor: colors.red, borderWidth: 0, paddingRight: 20, paddingLeft: 20, minWidth: '90%'
        }]}>
        <Message error={state.errors.message} message={state.data.message} />
        
        <SelectBox 
          name="territory" 
          data-name="territoryId" 
          showLabel={true} 
          label={Language.translate("Select Territory")} 
          options={state.availableTerritories.map(t => ({
            label: Language.translate('Territory') + ' ' + t.number + ' (' + t.date + ')', 
            value: t.territoryId
          }))} 
          value={{
            value: state.newTerritory && state.newTerritory.value, 
            label: state.newTerritory && state.newTerritory.label
          }} 
          error={state.errors.territoryId} 
          onInput={this.saveData} 
        />

        <Button 
          customStyle={{backgroundColor: colors.green}} 
          disabled={!state.newTerritory || !state.newTerritory.value} 
          onPress={this.assignTerritory}
          >
          {Language.translate('Assign Territory')}
        </Button>

        <Line />

        <View style={[style.section, style['listings-results'], style['listings-results-address']]}>
          {listings}
        </View>
      
        <View style={{ height: 60 }} />
        
			</View>
		);
  }
  updatePublisherAfterRemoveTerritory = (data, territoryId = null) => {
    const availableTerritories = this.state.availableTerritories.slice();
    const territory = this.state.data.territories.find(t => t.territoryId === territoryId);
    // console.log('territory', territory);

    if (!!territory) {
      availableTerritories.push(territory);
    }
    
		this.setState({data, availableTerritories}, () => {
      if (typeof this.props.navigation.getParam('updatePublisher') === 'function') {
        this.props.navigation.getParam('updatePublisher')(data, availableTerritories);
      }
    })
  }
	saveData = (data) => {
    console.log('data', data);
    const newData = {...this.state.newTerritory, ...data.option};
	
    return this.setState({
      newTerritory: newData, 
      errors: {
        newTerritory: '',
        message: ''
      }
    });
	}
	assignTerritory = () => {
    if (!this.state.newTerritory || !this.state.newTerritory.value) {
      return this.setState({errors: {
        ...this.state.errors,
        message: Language.translate('Territory is required')
      }});
    }

    const postData = {
      "publisherId": this.state.data.publisherId, 
      "date": UTILS.getToday()
    };
    // console.log('postData', postData);

    const territoryId = this.state.newTerritory.value;
    
    // Delete address
    Data.getApiData(`territories/${territoryId}`, postData, 'POST')
    .then(res => {
      console.log('then() res', res);

      if (!res || res.error) {
        this.setState({errors: {
          ...this.state.errors,
          message: (res && res.error) || Language.translate('An error occured')
        }});
      } else {
        const newTerritories = this.state.data.territories.slice() || [];
        const selectedTerritory = this.state.availableTerritories.find(t => t.territoryId === territoryId);
        const availableTerritories = this.state.availableTerritories.filter(t => t.territoryId !== territoryId);
        newTerritories.push({
          ...selectedTerritory,
          date: postData.date,
          publisherId: postData.publisherId,
        })
        const newData = {...this.state.data, territories: newTerritories};
        // console.log('newData', newData);
        this.setState({
          errors: {
            newTerritory: '',
            message: ''
          },
          data: newData,
          availableTerritories
        }, () => {
          if (typeof this.props.navigation.getParam('updatePublisher') === 'function') {
            this.props.navigation.getParam('updatePublisher')(newData, availableTerritories);
            // TODO: update availableTerritories
          }
        });
      }

    })
    .catch(e => {
      this.setState({errors: {
        ...this.state.errors,
        message: 'An error occured: ' + e
      }});
    });
	}
}  