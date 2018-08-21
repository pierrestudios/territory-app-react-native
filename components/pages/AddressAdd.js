import React from 'react';
import { View } from 'react-native';

import AddressEdit from '../pages/AddressEdit';
import {ButtonHeader} from '../elements/Button';

import Language from '../common/lang';
import UTILS from '../common/utils';

export default class AddressAdd extends AddressEdit {
  static navigationOptions = {
    ...UTILS.headerNavOptionsDefault,
		headerRight: (<View />), // To center on Andriod
    title: Language.translate('Add Address'),
    headerRight: (
      <ButtonHeader
        onPress={() => {false}}
        title="Save"
        color="#fff"
      />
    ),
  }
  allTerritories=false
}