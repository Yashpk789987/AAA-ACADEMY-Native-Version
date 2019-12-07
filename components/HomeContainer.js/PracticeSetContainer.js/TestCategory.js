import React from 'react';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
  SlideAnimation
} from 'react-native-popup-dialog';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
  AsyncStorage,
  RefreshControl
} from 'react-native';
import {
  Container,
  Thumbnail,
  Header,
  Left,
  Right,
  Body,
  Icon,
  Button,
  Card,
  CardItem,
  ListItem,
  Form,
  Input,
  Item,
  Label
} from 'native-base';

import { GlobalContext, ThemeContext } from '../../../GlobalContext';
import { baseurl, endurl } from '../../../baseurl';
import { DotIndicator, BallIndicator } from 'react-native-indicators';
import { FlatList } from 'react-native-gesture-handler';

export default class TestCategory extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      online_tests: [],
      online_tests_loading: true,
      authorization_phase_starts: false,
      authorization_phase_ends: false,
      authorizing: false,
      test_code: '',
      password: '',
      selected_test: null,
      message: '',
      student_id: null,
      offset: 0,
      scroll_loading: false,
      payment_status: true
    };
  }

  moveToPaymentGateWay = refresh_fun => {
    this.props.navigation.navigate('PaymentGateWayComponent', {
      refresh_payment_status: refresh_fun
    });
  };

  handleScrollLoad = async () => {
    if (this.state.payment_status === true) {
      let student_id = JSON.parse(await AsyncStorage.getItem('student'))._id;

      this.setState({ scroll_loading: true });
      let prev_length = this.state.online_tests;
      fetch(
        `${baseurl}tests/fetch_offline_tests_withoffset/${student_id}/${this.state.offset}/${endurl}`
      )
        .then(res => res.json())
        .then(async data => {
          let new_offset = this.state.offset;
          let new_length = data.length;
          if (prev_length === new_length) {
          } else {
            new_offset = this.state.offset + 6;
          }
          let old_data = this.state.online_tests;
          old_data.push(...data);
          await this.setState({
            offset: new_offset,
            online_tests: old_data,
            scroll_loading: false
          });
        })
        .catch(err => {
          console.log(err);
          alert('Technical Error. Please Try Again');
        });
    }
  };

  handleCategoryClick = async test => {
    if (test.set_password === 'true') {
      await this.setState({
        authorization_phase_starts: true,
        selected_test: test
      });
    } else {
      await this.setState({ selected_test: test });
      this.props.navigation.navigate('TestSwiper', {
        test: this.state.selected_test,
        refresh_list: this.refresh_list
      });
    }
  };

  refresh_list = async () => {
    let prev_length = this.state.online_tests.length;
    this.setState({ online_tests_loading: true });
    let student_id = JSON.parse(await AsyncStorage.getItem('student'))._id;
    fetch(
      `${baseurl}tests/fetch_offline_tests_withoffset/${student_id}/${0}/${endurl}`
    )
      .then(res => res.json())
      .then(async data => {
        let new_offset = 0;
        let new_length = data.length;
        if (prev_length === new_length) {
        } else {
          new_offset = new_offset + 6;
        }
        await this.setState({
          offset: new_offset,
          online_tests: data,
          online_tests_loading: false
        });
      })
      .catch(err => {
        console.log(err);
        alert('Technical Error. Please Try Again');
      });
  };

  componentDidMount = async () => {
    let prev_length = this.state.online_tests.length;
    let { _id, payment_status } = JSON.parse(
      await AsyncStorage.getItem('student')
    );
    this.setState({ payment_status: payment_status == 'true' });

    fetch(
      `${baseurl}tests/fetch_offline_tests_withoffset/${_id}/${this.state.offset}/${endurl}`
    )
      .then(res => res.json())
      .then(async data => {
        let new_offset = this.state.offset;
        let new_length = data.length;
        if (prev_length === new_length) {
        } else {
          new_offset = this.state.offset + 6;
        }
        await this.setState({
          offset: new_offset,
          online_tests: data,
          online_tests_loading: false
        });
      })
      .catch(err => {
        console.log(err);
        alert('Technical Error. Please Try Again');
      });
  };

  handle_verify = () => {
    if (this.state.test_code === '' || this.state.password === '') {
      this.setState({ message: 'Please Fill Up All Fields' });
    } else {
      this.setState({ message: '', authorizing: true });
      fetch(`${baseurl}authorize/authorize/${endurl}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            this.setState({
              authorization_phase_starts: false,
              authorizing: false
            });
            this.props.navigation.navigate('TestSwiper', {
              test: this.state.selected_test,
              refresh_list: this.refresh_list
            });
          } else {
            this.setState({
              message: 'Wrong Code/Password',
              authorizing: false
            });
          }
        })
        .catch(err => console.log(err));
    }
  };

  componentDidUpdate() {}

  render() {
    return (
      <ThemeContext.Consumer>
        {theme => {
          return (
            <Container style={{ backgroundColor: theme.background }}>
              <Modal
                animationType='fade'
                transparent={true}
                visible={this.state.authorizing}
                onRequestClose={() => alert('Closed')}
              >
                <View style={{ paddingTop: '20%' }}>
                  <DotIndicator color='white' />
                </View>
              </Modal>
              <Dialog
                width={1}
                height={0.6}
                visible={this.state.authorization_phase_starts}
                dialogTitle={<DialogTitle title='Verfication' />}
                footer={
                  <DialogFooter>
                    <DialogButton
                      text='CANCEL'
                      onPress={() => {
                        this.setState({ authorization_phase_starts: false });
                      }}
                    />
                    <DialogButton
                      text='VERIFY'
                      onPress={() => this.handle_verify()}
                    />
                  </DialogFooter>
                }
                dialogAnimation={
                  new SlideAnimation({
                    slideFrom: 'bottom'
                  })
                }
              >
                <DialogContent style={{ paddingTop: '4%', height: '60%' }}>
                  <Form>
                    <Item stackedLabel>
                      <Label>Test Code</Label>
                      <Input
                        onChangeText={text =>
                          this.setState({ test_code: text })
                        }
                      />
                    </Item>
                    <Item stackedLabel>
                      <Label>Password</Label>
                      <Input
                        secureTextEntry={true}
                        onChangeText={text => this.setState({ password: text })}
                      />
                    </Item>
                  </Form>
                  <Text style={{ color: 'red', paddingLeft: '5%' }}>
                    {`\n`}
                    {this.state.message}
                  </Text>
                </DialogContent>
              </Dialog>
              <Header
                style={[
                  styles.androidHeader,
                  { backgroundColor: theme.header_background_color }
                ]}
              >
                <Left>
                  <GlobalContext.Consumer>
                    {({ drawer_reference }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => drawer_reference.openDrawer()}
                          hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
                        >
                          <Icon
                            name='menu'
                            style={{ color: 'white', paddingLeft: '20%' }}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  </GlobalContext.Consumer>
                </Left>
                <Body
                  style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{ color: 'white', fontSize: 19, paddingLeft: '20%' }}
                  >
                    Offline Tests
                  </Text>
                </Body>
                <Right>
                  <TouchableOpacity
                    onPress={() => {
                      this.moveToPaymentGateWay(payment_status => {
                        if (payment_status === true) {
                          this.refresh_list();
                        }
                        this.setState({
                          payment_status: payment_status
                        });
                      });
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 19,
                        paddingRight: '10%',
                        fontStyle: 'italic'
                      }}
                    >
                      Pay
                    </Text>
                  </TouchableOpacity>
                </Right>
              </Header>
              {this.state.payment_status ? (
                <></>
              ) : (
                <Card style={{ marginTop: '10%' }}>
                  <ListItem thumbnail>
                    <Left></Left>
                    <Body>
                      <Text style={{ fontSize: 15, color: 'black' }}>
                        {
                          'These Tests are for demo purpose only ... \nUpgrade to Unlock All Practice Sets'
                        }
                      </Text>
                    </Body>
                  </ListItem>
                  <CardItem>
                    <Body>
                      <Text> </Text>
                    </Body>
                    <Right>
                      <Button
                        transparent
                        onPress={() => {
                          this.moveToPaymentGateWay(payment_status => {
                            if (payment_status === true) {
                              this.refresh_list();
                            }
                            this.setState({
                              payment_status: payment_status
                            });
                          });
                        }}
                      >
                        <Text style={{ color: 'blue' }}> Pay Now </Text>
                        <Icon active name='arrow-round-forward' size={18} />
                      </Button>
                    </Right>
                  </CardItem>
                </Card>
              )}
              {this.state.online_tests_loading ? (
                <BallIndicator
                  style={{ padding: '5%' }}
                  color={theme.spinner_color}
                />
              ) : (
                <FlatList
                  data={this.state.online_tests}
                  renderItem={({ item }) => {
                    return (
                      <Card key={item._id}>
                        <ListItem thumbnail>
                          <Left>
                            <Thumbnail
                              square
                              source={require('../../../assets/test.jpg')}
                            />
                          </Left>
                          <Body>
                            <Text style={{ fontSize: 20, color: 'black' }}>
                              {item.english_title}
                            </Text>
                          </Body>
                        </ListItem>
                        <CardItem>
                          <Body>
                            <Text> </Text>
                          </Body>
                          <Right>
                            <Button
                              transparent
                              onPress={() => {
                                this.handleCategoryClick(item);
                              }}
                            >
                              <Text style={{ color: 'blue' }}> Start Now </Text>
                              <Icon
                                active
                                name='arrow-round-forward'
                                size={18}
                              />
                            </Button>
                          </Right>
                        </CardItem>
                      </Card>
                    );
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={false}
                      onRefresh={() => this.refresh_list()}
                    />
                  }
                  keyExtractor={item => item._id}
                  initialNumToRender={6}
                  onEndReached={this.handleScrollLoad}
                  onEndReachedThreshold={0.1}
                />
              )}

              {this.state.scroll_loading ? (
                <View style={{ paddingTop: '10%', paddingBottom: '15%' }}>
                  <DotIndicator
                    color={theme.spinner_color}
                    animationDuration={800}
                    count={4}
                  />
                </View>
              ) : (
                <></>
              )}
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
        marginTop: 0
      }
    })
  },
  androidHeaderTitle: {
    ...Platform.select({
      android: {
        alignItems: 'flex-end'
      }
    })
  }
});
