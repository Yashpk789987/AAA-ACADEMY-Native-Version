import React from 'react';

import {baseurl, endurl} from '../../../baseurl';
import RazorpayCheckout from 'react-native-razorpay';

import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  AsyncStorage,
  ToastAndroid,
  Image,
} from 'react-native';

import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
  SlideAnimation,
} from 'react-native-popup-dialog';

import {
  Container,
  Header,
  Content,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Button,
  Spinner,
  Form,
  Label,
  Input,
  Item,
  Card,
  CardItem,
  Thumbnail,
} from 'native-base';

import {ThemeContext} from '../../../GlobalContext';
import ShowAllPayments from './ShowAllPayments';

export default class PaymentMainPage extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      package_selected: false,
      sample_id_of_package_selected: null,
      selectedbackgroundcolor: '',
      proceeding: false,
      open_dialog: false,
      mobile_number: '',
      email_id: '',
      message: '',
      payment_final_id: null,
      payment_done: false,
      student_id: null,
      posting_on_server: false,
      payment_status: false,
      open_confirm_dialog: false,
      packs: [
        {
          id: 1,
          name: 'silver',
          pic: `${baseurl}uploads/assets/silver.JPG`,
        },
        {
          id: 2,
          name: 'gold',
          pic: `${baseurl}uploads/assets/gold.JPG`,
        },
        {
          id: 3,
          name: 'platinum',
          pic: `${baseurl}uploads/assets/platinum.JPG`,
        },
      ],
    };
  }

  componentDidMount = async () => {
    try {
      let student = JSON.parse(await AsyncStorage.getItem('student'));
      if (student.payment_status == 'true') {
        this.setState({payment_status: true});
      }
    } catch (err) {
      console.log(err);
    }
  };

  setTransactionFinalId = trans_id => {
    this.setState({payment_final_id: trans_id});
    this.submitPaymentOnServer(trans_id);
  };

  closeDialog = () => {
    this.setState({open_confirm_dialog: false});
  };

  updateCache = async () => {
    this.setState({open_confirm_dialog: true});
    try {
      let student = JSON.parse(await AsyncStorage.getItem('student'));
      student.payment_status = 'true';
      await AsyncStorage.setItem('student', JSON.stringify(student));
    } catch (err) {
      console.log(err);
    }
  };

  submitPaymentOnServer = trans_id => {
    this.setState({posting_on_server: true});
    fetch(`https://www.instamojo.com/api/1.1/payment-requests/${trans_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': '18d2c2a55141fca1b31bcfb9ac9e1674',
        'X-Auth-Token': '021f6c6ac9a65387e6ca1ea5b7f2c637',
      },
    })
      // fetch(`https://test.instamojo.com/api/1.1/payment-requests/${trans_id}`, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Api-Key': 'test_d23de9e296e298e0bfb8062ad46',
      //     'X-Auth-Token': 'test_94e327959ece8b0afa8d84af11c'
      //   }
      // })
      .then(res => res.json())
      .then(data => {
        if (data.payment_request.payments[0].status == 'Failed') {
          ToastAndroid.show(
            'Transaction Failed ..Please Try Again .. ',
            ToastAndroid.LONG,
          );
          this.setState({posting_on_server: false});
        } else {
          let student_id = this.state.student_id;
          let pack_id = this.state.sample_id_of_package_selected;
          data = Object.assign(data, {
            student_id: student_id,
            pack_id: pack_id,
          });
          fetch(`${baseurl}payment/submit_payment_details/${endurl}`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then(res => {
              res.json();
            })
            .then(async data => {
              this.setState({
                payment_done: true,
                posting_on_server: false,
                payment_status: true,
              });
              this.updateCache();
            })
            .catch(err => {
              alert('Technical Error');
            });
        }
      })
      .catch(function(error) {
        console.log('error', error);
      });
  };

  handleSelectPackage = sample_id_of_package_selected => {
    this.setState({
      sample_id_of_package_selected: sample_id_of_package_selected,
      package_selected: true,
    });
  };

  handlePayment = async () => {
    if (this.state.sample_id_of_package_selected != null) {
      this.setState({open_dialog: true});
    } else {
      alert('Please Choose Any One Pack');
    }
  };

  InstamojoCheckOut = (name, _id) => {
    fetch(`${baseurl}payment/payment_instamojo/${endurl}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        _id: _id,
        email_id: this.state.email_id,
        mobile_number: this.state.mobile_number,
        pack_id: this.state.sample_id_of_package_selected,
      }),
    })
      .then(res => res.json())
      .then(data => {
        this.setState({proceeding: false});
        this.props.navigation.navigate('PaymentWebView', {
          payment_request: data.payment_request,
          student_id: _id,
          pack_id: this.state.sample_id_of_package_selected,
          setTransactionFinalId: this.setTransactionFinalId,
        });
      })
      .catch(err => console.log(err));
  };

  findAmountByPackId = pack_id => {
    // return '1000';
    let amount = 0;
    switch (pack_id) {
      case 1:
        amount = 100;
        break;
      case 2:
        amount = 300;
        break;
      case 3:
        amount = 500;
        break;
    }
    let total_amount = (amount + amount * 0.02 + 3) * 100;
    return total_amount.toString();
  };

  RazorPayCheckOut = (name, _id) => {
    var options = {
      currency: 'INR',
      key: 'rzp_live_0Wq21CH2mgbCg6',
      //key: 'rzp_test_7PlrxGzntfxP5b',
      amount: this.findAmountByPackId(this.state.sample_id_of_package_selected),
      name: 'Ashish Agrawal',
      prefill: {
        email: this.state.email_id,
        contact: this.state.mobile_number,
        name: name,
      },
    };
    RazorpayCheckout.open(options)
      .then(data => {
        this.setState({posting_on_server: true});
        let student_id = this.state.student_id;
        let pack_id = this.state.sample_id_of_package_selected;
        let payment_request = {
          payments: [
            {
              amount: this.findAmountByPackId(pack_id) / 100,
              payment_id: data.razorpay_payment_id,
            },
          ],
        };
        data = Object.assign(data, {
          payment_request: payment_request,
          student_id: student_id,
          pack_id: pack_id,
        });

        fetch(`${baseurl}payment/submit_payment_details/${endurl}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(res => {
            res.json();
          })
          .then(async data => {
            this.setState({
              payment_done: true,
              posting_on_server: false,
              payment_status: true,
            });
            this.updateCache();
          })
          .catch(err => {
            alert('Technical Error');
          });
      })
      .catch(error => {
        ToastAndroid.show(
          'Transaction Failed .. Please Try Again .. ',
          ToastAndroid.LONG,
        );
        this.setState({posting_on_server: false, proceeding: false});
      });
  };

  handleProceed = async () => {
    if (this.state.mobile_number === '' || this.state.email_id === '') {
      this.setState({message: 'Please Fill All Fields'});
    } else if (this.state.mobile_number.length != 10) {
      this.setState({message: 'Mobile Number Is Invalid ..'});
    } else {
      this.setState({message: '', open_dialog: false, proceeding: true});
      let {name, _id} = JSON.parse(await AsyncStorage.getItem('student'));
      this.setState({student_id: _id});
      //this.InstamojoCheckOut(name, _id);
      this.RazorPayCheckOut(name, _id);
    }
  };

  render() {
    if (this.state.posting_on_server === true) {
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
                      onPress={() => {
                        this.props.navigation.goBack();
                      }}
                      hitSlop={{top: 20, bottom: 20, left: 30, right: 30}}>
                      <Icon
                        name="arrow-back"
                        style={{color: 'white', paddingLeft: '20%'}}
                      />
                    </TouchableOpacity>
                  </Left>
                  <Body>
                    <Text style={{color: 'white', fontSize: 19}}>
                      Redirecting.....{' '}
                    </Text>
                  </Body>
                  <Right />
                </Header>
                <Content
                  style={{
                    paddingTop: '8%',
                    paddingLeft: '5%',
                    paddingRight: '5%',
                  }}>
                  <Spinner color="white" />
                </Content>
              </Container>
            );
          }}
        </ThemeContext.Consumer>
      );
    } else if (this.state.payment_status === true) {
      return (
        <>
          <ShowAllPayments
            goBack={this.props.screenProps.goBack}
            refresh_payment_status={
              this.props.screenProps.refresh_payment_status
            }
            closeDialog={this.closeDialog}
            open_confirm_dialog={this.state.open_confirm_dialog}
          />
        </>
      );
    }
    return (
      <ThemeContext.Consumer>
        {theme => {
          return (
            <Container style={{backgroundColor: theme.background}}>
              <Dialog
                width={1}
                height={0.6}
                dialogStyle={{position: 'absolute', top: 0}}
                visible={this.state.open_dialog}
                dialogTitle={<DialogTitle title="Contact Details" />}
                footer={
                  <DialogFooter>
                    <DialogButton
                      text="CANCEL"
                      onPress={() => {
                        this.setState({open_dialog: false});
                      }}
                    />
                    <DialogButton
                      text="PROCEED"
                      onPress={() => {
                        this.handleProceed();
                      }}
                    />
                  </DialogFooter>
                }
                dialogAnimation={
                  new SlideAnimation({
                    slideFrom: 'top',
                  })
                }>
                <DialogContent style={{paddingTop: '4%', height: '60%'}}>
                  <Form>
                    <Item stackedLabel>
                      <Label>Mobile Number </Label>
                      <Input
                        keyboardType={'numeric'}
                        onChangeText={text =>
                          this.setState({mobile_number: text})
                        }
                      />
                    </Item>
                    <Item stackedLabel>
                      <Label>Email Id </Label>
                      <Input
                        keyboardType={'email-address'}
                        onChangeText={text => this.setState({email_id: text})}
                      />
                    </Item>
                  </Form>
                  <Text style={{color: 'red', paddingLeft: '5%'}}>
                    {`\n`}
                    {this.state.message}
                  </Text>
                </DialogContent>
              </Dialog>
              <Header
                style={[
                  styles.androidHeader,
                  {backgroundColor: theme.header_background_color},
                ]}>
                <Left>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.screenProps.goBack();
                    }}
                    hitSlop={{top: 20, bottom: 20, left: 30, right: 30}}>
                    <Icon
                      name="arrow-back"
                      style={{color: 'white', paddingLeft: '20%'}}
                    />
                  </TouchableOpacity>
                </Left>
                <Body>
                  <Text style={{color: 'white', fontSize: 19}}>Payment </Text>
                </Body>
                <Right />
              </Header>

              <Text
                style={{
                  color: theme.text_color,
                  fontSize: 20,
                  textAlign: 'center',
                  paddingBottom: '5%',
                  paddingTop: '5%',
                }}>
                Choose Pack
              </Text>

              <Content>
                {this.state.packs.map((item, index) => {
                  return (
                    <Card key={index}>
                      <CardItem>
                        <Left>
                          <Thumbnail
                            source={require(`../../../assets/logo1.png`)}
                          />
                          <Body>
                            <Text>AAA Academy </Text>
                            <Text note>ER. Ashish Agrawal</Text>
                          </Body>
                        </Left>
                      </CardItem>
                      <CardItem cardBody>
                        <Image
                          source={{
                            uri: item.pic,
                          }}
                          onError={e => alert(e)}
                          style={{width: 384, height: 300, flex: 1}}
                        />
                      </CardItem>
                      <CardItem>
                        <Right style={{flex: 1, alignItems: 'flex-end'}}>
                          <Button
                            onPress={async () => {
                              await this.setState({
                                sample_id_of_package_selected: item.id,
                              });
                              if (!this.state.proceeding) {
                                this.handlePayment();
                              }
                            }}
                            large
                            style={{
                              width: '100%',
                              textAlign: 'center',
                            }}>
                            {this.state.proceeding === true ? (
                              <Text
                                style={{
                                  color: '#e5e4e2',
                                  fontSize: 15,
                                  textAlign: 'center',
                                }}>
                                Proceeding ...
                              </Text>
                            ) : (
                              <Text style={{color: '#e5e4e2', fontSize: 17}}>
                                Proceed
                              </Text>
                            )}

                            {this.state.proceeding === true ? (
                              <Spinner
                                color="white"
                                style={{paddingRight: '5%'}}
                              />
                            ) : (
                              <Icon name="md-arrow-round-forward" />
                            )}
                          </Button>
                        </Right>
                      </CardItem>
                    </Card>
                  );
                })}
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

//let data = JSON.parse(JSON.stringify(response));
// console.log(data);
//console.log(data._bodyInit.payment_request.payments[0].status);
//   if (JSON.parse(data._bodyInit).payments[0] === false) {
//     ToastAndroid.show(
//       'Transaction Failed...\n PLease Try Again ',
//       ToastAndroid.LONG
//     );
//   } else {
//     let student_id = this.state.student_id;
//     let pack_id = this.state.sample_id_of_package_selected;
//     data = Object.assign(data, {
//       student_id: student_id,
//       pack_id: pack_id
//     });
//     fetch(`${baseurl}payment/submit_payment_details/${endurl}`, {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//       .then(res => {
//         res.json();
//       })
//       .then(async data => {
//         this.setState({ payment_done: true, posting_on_server: false });
//         this.updateCache();
//       })
//       .catch(err => {
//         alert('Technical Error');
//       });
//   }
// })
// .catch(function(error) {
//   console.log('error', error);
// });

// var options = {
//   description: 'Credits towards consultation',
//   image: 'https://i.imgur.com/3g7nmJC.png',
//   currency: 'INR',
//   key: 'rzp_test_7PlrxGzntfxP5b',
//   amount: '5000',
//   name: 'foo',
//   prefill: {
//     email: 'void@razorpay.com',
//     contact: '9191919191',
//     name: 'Razorpay Software'
//   },
//   theme: { color: '#F37254' }
// };
// RazorpayCheckout.open(options)
//   .then(data => {
//     // handle success
//     alert(`Success: ${data.razorpay_payment_id}`);
//   })
//   .catch(error => {
//     // handle failure
//     alert(`Error: ${error.code} | ${error.description}`);
//   });

// 79	T-18 (PERCENTAGE BASIC)		null	null	2019-10-25	09:00:00	2700		23:00:00	false	true	true
