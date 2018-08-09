import Territories from '../pages/Territories';
import Language from '../common/lang';
import UTILS from '../common/utils';

export default class MyTerritories extends Territories {
  static navigationOptions = {
    ...UTILS.headerNavOptionsDefault,
    title: Language.translate('My Territories'),
  }
  allTerritories=false
}