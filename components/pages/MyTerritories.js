import Territories from '../pages/Territories';

export default class MyTerritories extends Territories {
  static navigationOptions = {
    headerTitle: null,
    title: 'My Territories',
    headerTintColor: '#fff',
  }
  allTerritories=false
}