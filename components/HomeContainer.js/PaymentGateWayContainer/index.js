import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import PaymentMainPage from '../PaymentGateWayContainer/PaymentMainPage';
import PaymentWebView from '../PaymentGateWayContainer/PaymentWebView';

const AppNavigator = createStackNavigator({
  PaymentMainPage: {
    screen: PaymentMainPage
  },
  PaymentWebView: {
    screen: PaymentWebView
  }
});

const AppContainer = createAppContainer(AppNavigator);

export default class __ extends React.Component {
  static navigationOptions = {
    header: null
  };
  render() {
    let refresh_payment_status_ref = this.props.navigation.getParam(
      'refresh_payment_status'
    );

    return (
      <AppContainer
        screenProps={{
          refresh_payment_status: refresh_payment_status_ref,
          goBack: this.props.navigation.goBack
        }}
      />
    );
  }
}
