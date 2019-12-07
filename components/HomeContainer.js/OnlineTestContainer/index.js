import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import TestCategory from './TestCategory';
import TestSwiper from './TestSwiper';
import PaymentGateWayComponent from '../PaymentGateWayContainer/index';

import { GlobalContext } from '../../../GlobalContext';

const AppNavigator = createStackNavigator(
  {
    TestCategory: {
      screen: TestCategory
    },
    TestSwiper: {
      screen: TestSwiper
    },
    PaymentGateWayComponent: {
      screen: PaymentGateWayComponent
    }
  },
  {
    navigationOptions: {
      gesturesEnabled: false
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class __ extends React.Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <GlobalContext.Provider
        value={{ drawer_reference: this.props.navigation }}
      >
        <AppContainer />
      </GlobalContext.Provider>
    );
  }
}
