import React from 'react';
import {AsyncStorage, StatusBar} from 'react-native';
import {LoginManager} from 'react-native-fbsdk';
import Login from '../components/Login';
import {GoogleSignin} from 'react-native-google-signin';
import HomeContainer from './HomeContainer.js';
import SplashScreen from 'react-native-splash-screen';
import {ThemeContext} from '../GlobalContext';

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loggedIn: false,
      configured: false,
    };
  }

  async componentWillMount() {
    this.setState({loading: false});
  }

  componentDidMount = async () => {
    console.disableYellowBox = true;
    GoogleSignin.configure({
      scopes: ['profile', 'email'],
      webClientId:
        '825054366160-4njifgud17m2jg9acdpbt6tkobmmhsld.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      loginHint: '',
      forceConsentPrompt: true,
      accountName: '',
    });
    let student = await AsyncStorage.getItem('student');
    if (student !== null) {
      await this.setState({loggedIn: true, configured: true});
    } else {
      await this.setState({loggedIn: false, configured: true});
    }
    SplashScreen.hide();
  };

  makeLogout = async () => {
    let student = JSON.parse(await AsyncStorage.getItem('student'));
    if (student.login_type == 'google') {
      GoogleSignin.signOut();
    } else if (student.login_type == 'fb') {
      LoginManager.logOut();
    }

    await AsyncStorage.removeItem('student');
    this.setState({loggedIn: false});
  };

  makeLogin = () => {
    this.setState({loggedIn: true});
  };

  componentDidUpdate() {}

  render() {
    if (this.state.loggedIn) {
      return (
        <ThemeContext.Consumer>
          {theme => {
            return (
              <>
                <StatusBar hidden />
                <HomeContainer
                  makeLogout={this.makeLogout}
                  toggleTheme={this.props.toggleTheme}
                />
              </>
            );
          }}
        </ThemeContext.Consumer>
      );
    } else {
      return (
        <>
          <StatusBar hidden />
          <Login makeLogin={this.makeLogin} />
        </>
      );
    }
  }
}

export default MainComponent;
