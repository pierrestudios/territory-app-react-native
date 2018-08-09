import Territories from '../pages/Territories';
import Language from '../common/lang';

export default class MyTerritories extends Territories {
  static navigationOptions = {
    headerTitle: null,
    title: Language.translate('My Territories'),
    headerTintColor: '#fff',
  }
  allTerritories=false
}