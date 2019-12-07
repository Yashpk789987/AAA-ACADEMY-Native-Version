import {
  createDrawerNavigator,
  createAppContainer,
  SafeAreaView,
} from 'react-navigation';
import React from 'react';
import Home from './Home';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  AsyncStorage,
  PermissionsAndroid,
} from 'react-native';
import PracticeSheetsContainer from './PracticeSheetsContainer';
import OnlineTestContainer from './OnlineTestContainer';
import PracticeSetContainer from './PracticeSetContainer.js';
import PdfContainer from './PdfContainer';
import Settings from './Settings';
import {ThemeContext} from '../../GlobalContext';

import {Container, Header, Content, Body, Text, Icon} from 'native-base';

var component_theme = ThemeContext._currentValue;

class CustomDrawer___L extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pic_uri: '',
      login_type: '',
    };
  }

  requestPermission = async () => {
    if (
      !(
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ) &&
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        )
      )
    ) {
      try {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
      } catch (err) {
        console.warn(err);
      }
    }
  };
  componentDidMount = async () => {
    this.requestPermission();
    let student = JSON.parse(await AsyncStorage.getItem('student'));
    if (student.login_type === 'fb_login') {
      this.setState({
        name: student.name,
        pic_uri: student.fb_pic,
        login_type: student.login_type,
      });
    } else if (student.login_type === 'custom_login') {
      this.setState({name: student.name, login_type: student.login_type});
    } else if (student.login_type === 'google_login') {
      this.setState({
        name: student.name,
        pic_uri: student.google_pic,
        login_type: student.login_type,
      });
    }
  };
  render() {
    var pic = null;
    if (
      this.state.login_type === 'custom_login' ||
      this.state.pic_uri === null ||
      this.state.pic_uri === 'null'
    ) {
      pic = null;
    } else {
      pic = this.state.pic_uri;
    }

    return (
      <ThemeContext.Consumer>
        {theme => {
          component_theme = theme;
          return (
            <Container style={{backgroundColor: theme.background}}>
              <Content>
                <Header
                  style={[
                    styles.androidHeader,
                    {backgroundColor: theme.header_background_color},
                  ]}>
                  <Body>
                    <Text style={{fontSize: 20, color: 'white'}}>
                      {' '}
                      Hello, {this.state.name}
                    </Text>
                  </Body>
                </Header>
                <TouchableOpacity>
                  {pic === null ? (
                    <Image
                      source={require('../../assets/profile.png')}
                      style={{
                        height: 250,
                        width: null,
                        marginTop: 10,
                        flex: 1,
                      }}
                    />
                  ) : (
                    <Container
                      style={{width: null, height: 250, marginTop: 10}}>
                      <Image
                        resizeMode="cover"
                        style={{
                          flex: 1,
                          resizeMode: 'cover',

                          overflow: 'visible',
                        }}
                        source={{
                          uri: pic,
                        }}
                        onError={error => {
                          this.props.screenProps.makeLogOut();
                        }}
                      />
                    </Container>
                  )}
                </TouchableOpacity>

                <SafeAreaView
                  style={{flex: 1}}
                  forceInset={{top: 'always', horizontal: 'never'}}>
                  <TouchableOpacity
                    style={{
                      paddingLeft: '10%',
                      paddingTop: '10%',
                      flex: 1,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      this.props.navigation.closeDrawer();
                      this.props.navigation.navigate('Home');
                    }}>
                    <Icon name={'home'} style={{color: theme.outline_color}} />
                    <Text
                      style={{
                        color: theme.text_color,
                        paddingLeft: '5%',
                        paddingTop: '1%',
                      }}>
                      Home
                    </Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    style={{ paddingLeft: '15%', paddingTop: '10%' }}
                    onPress={() =>
                      this.props.navigation.navigate('Online WorkSheets')
                    }
                  >
                    <Text style={{ color: theme.text_color }}>
                      Online Worksheets
                    </Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={{
                      paddingLeft: '10%',
                      paddingTop: '10%',
                      flex: 1,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      this.props.navigation.closeDrawer();
                      this.props.navigation.navigate('Practice Sets');
                    }}>
                    <Icon
                      name={'folder-open'}
                      style={{color: theme.outline_color}}
                    />
                    <Text
                      style={{
                        color: theme.text_color,
                        paddingLeft: '5%',
                        paddingTop: '1%',
                      }}>
                      Offline Tests
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingLeft: '10%',
                      paddingTop: '10%',
                      flex: 1,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      this.props.navigation.closeDrawer();
                      this.props.navigation.navigate('Live Tests');
                    }}>
                    <Icon
                      name={'logo-rss'}
                      style={{color: theme.outline_color}}
                    />
                    <Text
                      style={{
                        color: theme.text_color,
                        paddingLeft: '5%',
                        paddingTop: '1%',
                      }}>
                      Online Tests
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingLeft: '10%',
                      paddingTop: '10%',
                      flex: 1,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      this.props.navigation.closeDrawer();
                      this.props.navigation.navigate('Download Pdfs');
                    }}>
                    <Icon
                      name={'document'}
                      style={{color: theme.outline_color}}
                    />
                    <Text
                      style={{
                        color: theme.text_color,
                        paddingLeft: '5%',
                        paddingTop: '1%',
                      }}>
                      Download Pdfs
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingLeft: '10%',
                      paddingTop: '10%',
                      flex: 1,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      this.props.navigation.closeDrawer();
                      this.props.navigation.navigate('Online WorkSheets');
                    }}>
                    <Icon
                      name={'md-paper'}
                      style={{color: theme.outline_color}}
                    />
                    <Text
                      style={{
                        color: theme.text_color,
                        paddingLeft: '5%',
                        paddingTop: '1%',
                      }}>
                      Download Pdfs
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingLeft: '10%',
                      paddingTop: '10%',
                      flex: 1,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      this.props.navigation.closeDrawer();
                      this.props.navigation.navigate('Settings');
                    }}>
                    <Icon
                      name={'settings'}
                      style={{color: theme.outline_color}}
                    />
                    <Text
                      style={{
                        color: theme.text_color,
                        paddingLeft: '5%',
                        paddingTop: '1%',
                      }}>
                      Settings
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingLeft: '10%',
                      paddingTop: '10%',
                      flex: 1,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      this.props.navigation.closeDrawer();
                      this.props.screenProps.makeLogOut();
                    }}>
                    <Icon
                      name={'md-arrow-back'}
                      style={{color: theme.outline_color}}
                    />
                    <Text
                      style={{
                        color: theme.text_color,
                        paddingLeft: '5%',
                        paddingTop: '1%',
                      }}>
                      Logout
                    </Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </Content>
            </Container>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

const AppNavigator = createDrawerNavigator(
  {
    Home: {
      screen: Home,
    },
    'Online WorkSheets': {
      screen: PracticeSheetsContainer,
    },
    'Practice Sets': {
      screen: PracticeSetContainer,
    },
    'Live Tests': {
      screen: OnlineTestContainer,
    },
    'Download Pdfs': {
      screen: PdfContainer,
    },
    Settings: {
      screen: Settings,
    },
  },
  {
    contentComponent: CustomDrawer___L,
    contentOptions: {
      inactiveTintColor: component_theme.name === 'dark' ? 'white' : 'black',
      activeBackgroundColor: component_theme.name === 'dark' ? 'white' : 'blue',
      activeTintColor: 'black',
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class __ extends React.Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <AppContainer
        screenProps={{
          toggleTheme: this.props.toggleTheme,
          makeLogOut: this.props.makeLogout,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  androidHeader: {
    ...Platform.select({
      android: {
        marginTop: 0,
      },
    }),
  },
});
