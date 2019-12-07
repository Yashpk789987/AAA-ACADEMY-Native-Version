import React from 'react';
import {
  Linking,
  Dimensions,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  View,
  AsyncStorage,
} from 'react-native';

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Text,
  Card,
  CardItem,
  Button,
  Thumbnail,
  Content,
  ListItem,
} from 'native-base';
import {ThemeContext} from '../../GlobalContext';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {baseurl, endurl, file_base_url} from '../../baseurl';

import Swiper from 'react-native-swiper';
import SocialShare from '../SocialShare';
import {DotIndicator, BallIndicator} from 'react-native-indicators';
import Enquiry from '../Enquiry';

class MainComponent extends React.Component {
  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  phonecall = () => {
    Linking.openURL(`tel:+917566642636`);
  };

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      share_dialog_visible: false,
      do_enquiry: false,
      updating_async_storage: false,
      downloading: false,
      ads_array: [],
      lower_adds_array: [],
      upper_adds_array: [],
    };
  }

  loadImageArray = async () => {
    this.setState({downloading: true});
    fetch(`${baseurl}ads/load_all_ads/${endurl}`)
      .then(res => res.json())
      .then(data => {
        let upper_adds_array = data.filter(item => {
          return item.category === 'upper';
        });

        let lower_adds_array = data.filter(item => {
          return item.category === 'lower';
        });

        this.setState({
          ads_array: data,
          upper_adds_array: upper_adds_array,
          lower_adds_array: lower_adds_array,
          downloading: false,
        });
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
  };

  fbShare = async () => {
    this.setState({share_dialog_visible: true});
  };

  componentDidMount = async () => {
    this.setState({updating_async_storage: true});
    let {_id} = JSON.parse(await AsyncStorage.getItem('student'));
    fetch(`${baseurl}students/show_by_id/${_id}/${endurl}`)
      .then(res => res.json())
      .then(async data => {
        try {
          await AsyncStorage.removeItem('student');
          AsyncStorage.setItem('student', JSON.stringify(data));
          this.setState({updating_async_storage: false});
        } catch (err) {
          console.log(err);
        }
      })
      .catch(err => console.log(err));
    let enquiry_data = await AsyncStorage.getItem('ENQUIRY');
    if (enquiry_data === null) {
      this.setState({do_enquiry: true});
    }
    this.loadImageArray();
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {theme => {
          return (
            <Container style={{backgroundColor: theme.background}}>
              <Header
                style={[
                  styles.androidHeader,
                  {backgroundColor: theme.header_background_color},
                ]}>
                <Left>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.openDrawer()}>
                    <Icon
                      name="menu"
                      style={{paddingLeft: '20%', color: 'white'}}
                    />
                  </TouchableOpacity>
                </Left>
                <Body
                  style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 19, paddingLeft: '26%'}}>
                    AAA ACADEMY
                  </Text>
                </Body>
                <Right>
                  <Menu
                    ref={this.setMenuRef}
                    style={{width: '45%', height: '20%'}}
                    button={
                      <Button
                        bordered
                        style={{
                          backgroundColor: theme.header_background_color,
                          borderColor: theme.header_background_color,
                        }}
                        onPress={this.showMenu}>
                        <Icon
                          name="more"
                          style={{fontSize: 32, color: 'white'}}
                        />
                      </Button>
                    }>
                    <MenuItem
                      style={{
                        height: '50%',
                      }}
                      textStyle={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                      onPress={() => {
                        this.hideMenu();
                        this.props.navigation.navigate('Settings');
                      }}>
                      Settings
                    </MenuItem>
                    <MenuDivider color="black" width={5} />
                    <MenuItem
                      style={{
                        height: '50%',
                      }}
                      textStyle={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                      onPress={() => {
                        ToastAndroid.show(
                          'Successfully Logged Out ',
                          ToastAndroid.SHORT,
                        );
                        this.hideMenu();
                        this.props.screenProps.makeLogOut();
                      }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </Right>
              </Header>
              <Enquiry do_enquiry={false} />
              <Content style={{padding: '4%'}}>
                <Container
                  style={{
                    backgroundColor: theme.background,
                    height: Dimensions.get('window').height * 0.4,
                  }}>
                  {this.state.downloading ? (
                    <BallIndicator
                      style={{padding: '5%'}}
                      color={theme.spinner_color}
                    />
                  ) : (
                    <Swiper autoplay={true} activeDotColor="white">
                      {this.state.upper_adds_array.map((item, index) => {
                        return (
                          <Container
                            key={index}
                            style={{
                              margin: '2%',
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              style={{
                                flex: 1,
                                resizeMode: 'contain',
                                aspectRatio: 1.5,
                              }}
                              source={{
                                uri: `${file_base_url}/ads/${item.image_url}`,
                              }}
                            />
                          </Container>
                        );
                      })}
                    </Swiper>
                  )}
                </Container>
                <Card style={{height: Dimensions.get('window').height * 0.7}}>
                  <CardItem>
                    <Left>
                      <Thumbnail source={require('../../assets/logo1.png')} />
                      <Body>
                        <Text>AAA ACADEMY</Text>
                        <Text note>ER. ASHISH AGRAWAL</Text>
                      </Body>
                    </Left>
                  </CardItem>
                  <CardItem cardBody>
                    <Body>
                      <ListItem icon style={{padding: '5%'}}>
                        <Left style={{paddingLeft: '5%'}}>
                          <Button
                            style={{backgroundColor: 'green'}}
                            onPress={() => this.phonecall()}>
                            <Icon name="call" />
                          </Button>
                        </Left>
                        <Right>
                          <Text>{'7000072790,\n7566642636'}</Text>
                        </Right>
                      </ListItem>
                      <ListItem icon style={{padding: '5%'}}>
                        <Left style={{paddingLeft: '5%'}}>
                          <Button
                            style={{backgroundColor: 'blue'}}
                            onPress={() => Linking.openURL('sms:7000072790')}>
                            <Icon name="mail" />
                          </Button>
                        </Left>
                        <Right>
                          <Text>{'7000072790'}</Text>
                        </Right>
                      </ListItem>
                      <ListItem icon style={{padding: '5%'}}>
                        <Left style={{paddingLeft: '5%'}}>
                          <Button
                            style={{backgroundColor: 'red'}}
                            onPress={() =>
                              Linking.openURL('mailto: shshagrawal05@gmail.com')
                            }>
                            <Icon name="mail" />
                          </Button>
                        </Left>
                        <Right>
                          <Text>{'shshagrawal05@gmail.com'}</Text>
                        </Right>
                      </ListItem>
                      <ListItem
                        icon
                        style={{padding: '5%'}}
                        itemDivider={false}>
                        <Left style={{paddingLeft: '5%'}}>
                          <Button
                            style={{backgroundColor: 'blue'}}
                            onPress={() =>
                              Linking.openURL('geo:26.214471, 78.202699')
                            }>
                            <Icon name="md-navigate" />
                          </Button>
                        </Left>
                        <Right style={{paddingTop: '4%'}}>
                          <Text>
                            {
                              'Sundaram Apartment , \nVivekananda Chauraha, \n Thatipur , Gwalior'
                            }
                          </Text>
                        </Right>
                      </ListItem>
                    </Body>
                  </CardItem>
                  <CardItem style={{marginTop: '15%'}}>
                    <SocialShare />
                  </CardItem>
                </Card>
                <Container
                  style={{
                    backgroundColor: theme.background,
                    height: Dimensions.get('window').height * 0.44,
                  }}>
                  {this.state.downloading ? (
                    <BallIndicator
                      style={{padding: '5%'}}
                      color={theme.spinner_color}
                    />
                  ) : (
                    <Swiper autoplay={true} activeDotColor="white">
                      {this.state.lower_adds_array.map((item, index) => {
                        return (
                          <Container
                            key={index}
                            style={{
                              margin: '2%',
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              style={{
                                flex: 1,
                                resizeMode: 'contain',
                                aspectRatio: 1.5,
                              }}
                              source={{
                                uri: `${file_base_url}/ads/${item.image_url}`,
                              }}
                            />
                          </Container>
                        );
                      })}
                    </Swiper>
                  )}
                </Container>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={this.state.updating_async_storage}
                  onRequestClose={() => alert('Closed')}>
                  <View
                    style={{
                      paddingTop: '40%',
                    }}>
                    <DotIndicator
                      color="white"
                      animationDuration={800}
                      count={4}
                    />
                    <Text
                      style={{
                        paddingTop: '5%',
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      Configuring Please Wait{' '}
                    </Text>
                  </View>
                </Modal>
                <Container
                  style={{
                    backgroundColor: theme.background,
                    height: Dimensions.get('window').height * 0.05,
                  }}
                />
              </Content>
            </Container>
          );
        }}
      </ThemeContext.Consumer>
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
  androidHeaderTitle: {
    ...Platform.select({
      android: {
        alignItems: 'flex-end',
      },
    }),
  },
});
export default MainComponent;

// default Dimensions of image is 384 * 272
