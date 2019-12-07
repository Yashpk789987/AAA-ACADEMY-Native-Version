// import React from 'react';
// import {
//   Text,
//   StyleSheet,
//   ImageBackground,
//   AsyncStorage,
//   Modal,
//   View,
// } from 'react-native';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from 'react-native-google-signin';
// import {AccessToken, LoginManager, LoginButton} from 'react-native-fbsdk';
// import {Button, Form, Input, Item, Label, Icon} from 'native-base';
// import {baseurl, endurl} from '../baseurl';
// import {DotIndicator} from 'react-native-indicators';

// export default class Login extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       email: '',
//       password: '',
//       facebook_id: '',
//       name: '',
//       fb_pic_uri: '',
//       fb_login: false,
//       google_login: false,
//       google_pic_uri: '',
//       google_id: '',
//       login_type: '',
//       loading: false,
//       share_dialog_visible: false,
//     };
//   }

//   componentDidMount = async () => {};

//   _signIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const result = await GoogleSignin.signIn();
//       console.log(result);
//       await this.setState({
//         name: result.user.name,
//         email: result.user.email,
//         google_pic_uri: result.user.photoUrl,
//         google_id: result.user.id,
//         loading: true,
//         login_type: 'google',
//       });

//       fetch(`${baseurl}students/student_login/${endurl}`, {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(this.state),
//       })
//         .then(res => res.json())
//         .then(async data => {
//           await AsyncStorage.setItem('student', JSON.stringify(data));
//           this.setState({loading: false});
//           this.props.makeLogin();
//         })
//         .catch(err => {
//           alert('Technical Error');
//           console.log(err);
//           this.setState({loading: false});
//         });
//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         alert('Login Cancelled ...');
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (f.e. sign in) is in progress already
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         alert('Play Services Are Not Available ');
//       } else {
//         // some other error happened
//       }
//     }
//   };

//   handleLogIn = async () => {
//     if (this.state.email === '') {
//       alert('Please Enter Email Id');
//     } else if (this.state.password === '') {
//       alert('Please Enter Password');
//     } else {
//       let a = await this.setState({
//         login_type: 'custom_login',
//         loading: true,
//       });
//     }
//     fetch(`${baseurl}students/student_login/${endurl}`, {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(this.state),
//     })
//       .then(res => res.json())
//       .then(async data => {
//         if (data.code === 'success') {
//           await AsyncStorage.setItem('student', JSON.stringify(data.student));
//           this.setState({loading: false});
//           this.props.makeLogin();
//         } else {
//           alert(data.message);
//           this.setState({loading: false});
//         }
//       })
//       .catch(err => {
//         alert('Technical Error');
//         this.setState({loading: false});
//         console.log(err);
//       });
//   };

//   fbLogIn = async (error, result) => {
//     LoginManager.logInWithPermissions(['public_profile']).then(
//       result => {
//         if (result.isCancelled) {
//           alert('Login was cancelled');
//         } else {
//           AccessToken.getCurrentAccessToken().then(async data => {
//             let token = data.accessToken.toString();

//             const response = await fetch(
//               `https://graph.facebook.com/me?fields=id,name,picture.width(384).height(272)&access_token=${token}`,
//             );

//             let res = await response.json();

//             await this.setState({
//               loading: true,
//               login_type: 'fb',
//               fb_login: true,
//               facebook_id: res.id,
//               name: res.name,
//               fb_pic_uri: res.picture.data.url,
//             });
//             fetch(`${baseurl}students/student_login/${endurl}`, {
//               method: 'POST',
//               headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify(this.state),
//             })
//               .then(res => res.json())
//               .then(async data => {
//                 await AsyncStorage.setItem('student', JSON.stringify(data));
//                 this.setState({loading: false});
//                 this.props.makeLogin();
//               })
//               .catch(err => {
//                 alert('Technical Error');

//                 this.setState({loading: false});
//               });
//           });
//         }
//       },
//       function(error) {
//         alert('Login failed with error: ' + error);
//       },
//     );
//   };

//   googleLogIn = async () => {
//     try {
//       await GoogleSignIn.askForPlayServicesAsync();
//       const result = await GoogleSignIn.signInAsync();
//       alert(result.type);
//       if (result.type === 'success') {
//         await this.setState({
//           name: result.user.name,
//           email: result.user.email,
//           google_pic_uri: result.user.photoUrl,
//           google_id: result.user.id,
//           loading: true,
//           login_type: 'google',
//         });

//         fetch(`${baseurl}students/student_login/${endurl}`, {
//           method: 'POST',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(this.state),
//         })
//           .then(res => res.json())
//           .then(async data => {
//             await AsyncStorage.setItem('student', JSON.stringify(data));
//             this.setState({loading: false});
//             this.props.makeLogin();
//           })
//           .catch(err => {
//             alert('Technical Error');
//             console.log(err);
//             this.setState({loading: false});
//           });
//       } else {
//       }
//     } catch (e) {
//       alert(e);
//       console.log(e);
//     }
//   };

//   render() {
//     return (
//       <ImageBackground
//         source={require('../assets/login.jpg')}
//         style={styles.container}>
//         <Form>
//           <Item floatingLabel>
//             <Label style={{color: 'white'}}>Email Id </Label>
//             <Input
//               onChangeText={text => this.setState({email: text})}
//               keyboardType="email-address"
//               selectionColor="white"
//               style={{color: 'white'}}
//             />
//           </Item>
//           <Item floatingLabel>
//             <Label style={{color: 'white'}}>Password</Label>
//             <Input
//               onChangeText={text => this.setState({password: text})}
//               secureTextEntry={true}
//               selectionColor="white"
//               style={{color: 'white'}}
//             />
//           </Item>
//           <Button
//             style={{
//               borderRadius: 5,
//               justifyContent: 'center',
//               width: '95%',
//               marginLeft: '5%',
//               backgroundColor: 'white',
//               marginTop: '7%',
//               paddingBottom: '4%',
//             }}
//             onPress={() => this.handleLogIn()}>
//             <Text style={{fontSize: 20}}>Login</Text>
//           </Button>
//           <Button
//             style={{
//               borderRadius: 5,
//               justifyContent: 'space-between',

//               width: '95%',
//               marginLeft: '5%',
//               backgroundColor: '#4267b2',
//               marginTop: '7%',
//               height: 45,
//               paddingBottom: '2%',
//             }}
//             onPress={() => this.fbLogIn()}>
//             <Icon name="logo-facebook" style={{fontSize: 35}} />
//             <View style={{paddingRight: '20%'}}>
//               <Text style={{fontSize: 20, color: 'white'}}>
//                 {' '}
//                 Facebook Login
//               </Text>
//             </View>
//           </Button>
//           <GoogleSigninButton
//             style={{
//               justifyContent: 'center',
//               height: 55,
//               width: '98%',
//               marginLeft: '4%',
//               marginTop: '3%',
//               borderRadius: 5,
//               paddingBottom: '4%',
//             }}
//             size={GoogleSigninButton.Size.Wide}
//             color={GoogleSigninButton.Color.Dark}
//             onPress={this._signIn}
//             disabled={this.state.isSigninInProgress}
//           />
//         </Form>
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={this.state.loading}
//           onRequestClose={() => alert('Closed')}>
//           <View style={{paddingTop: '40%'}}>
//             <DotIndicator color="white" animationDuration={800} count={4} />
//           </View>
//         </Modal>
//       </ImageBackground>
//     );
//   }
// }

// var styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: null,
//     height: null,
//     paddingTop: '40%',
//     paddingRight: '10%',
//   },
// });

import React from 'react';

import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  Modal,
  AsyncStorage,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
  SlideAnimation,
} from 'react-native-popup-dialog';

import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {Icon, Button, Spinner, Text} from 'native-base';
import {baseurl, endurl} from '../baseurl';
import {DotIndicator} from 'react-native-indicators';

import * as Animatable from 'react-native-animatable';
const height = Dimensions.get('window').height;

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preventEvents: false,
      email: '',
      password: '',
      facebook_id: '',
      name: '',
      fb_pic_uri: '',
      fb_login: false,
      google_login: false,
      google_pic_uri: '',
      google_id: '',
      login_type: '',
      loading: false,
      share_dialog_visible: false,
      social_modal: false,
    };
  }
  handleLogIn = async () => {
    if (this.state.email === '') {
      alert('Please Enter Email Id');
      return;
    } else if (this.state.password === '') {
      alert('Please Enter Password');
      return;
    } else {
      let a = await this.setState({
        login_type: 'custom_login',
        loading: true,
      });
    }

    fetch(`${baseurl}students/student_login/${endurl}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then(res => res.json())
      .then(async data => {
        if (data.code === 'success') {
          await AsyncStorage.setItem('student', JSON.stringify(data.student));
          this.setState({loading: false});
          this.props.makeLogin();
        } else {
          alert(data.message);
          this.setState({loading: false});
        }
      })
      .catch(err => {
        alert('Technical Error');
        this.setState({loading: false});
        console.log(err);
      });
  };

  _signIn = async () => {
    this.setState({social_modal: false});
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      console.log(result);
      await this.setState({
        name: result.user.name,
        email: result.user.email,
        google_pic_uri: result.user.photo,
        google_id: result.user.id,
        loading: true,
        login_type: 'google',
      });

      fetch(`${baseurl}students/student_login/${endurl}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })
        .then(res => res.json())
        .then(async data => {
          console.log(data);
          await AsyncStorage.setItem('student', JSON.stringify(data));
          this.setState({loading: false});
          this.props.makeLogin();
        })
        .catch(err => {
          alert('Technical Error');
          console.log(err);
          this.setState({loading: false});
        });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('Login Cancelled ...');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Play Services Are Not Available ');
      } else {
        console.log(error);
      }
    }
  };

  fbLogIn = async () => {
    this.setState({social_modal: false});
    LoginManager.logInWithPermissions(['public_profile']).then(
      result => {
        if (result.isCancelled) {
          alert('Login was cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(async data => {
            let token = data.accessToken.toString();

            const response = await fetch(
              `https://graph.facebook.com/me?fields=id,name,picture.width(384).height(272)&access_token=${token}`,
            );

            let res = await response.json();

            await this.setState({
              loading: true,
              login_type: 'fb',
              fb_login: true,
              facebook_id: res.id,
              name: res.name,
              fb_pic_uri: res.picture.data.url,
            });
            fetch(`${baseurl}students/student_login/${endurl}`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.state),
            })
              .then(res => res.json())
              .then(async data => {
                await AsyncStorage.setItem('student', JSON.stringify(data));
                this.setState({loading: false});
                this.props.makeLogin();
              })
              .catch(err => {
                alert('Technical Error');

                this.setState({loading: false});
              });
          });
        }
      },
      function(error) {
        alert('Login failed with error: ' + error);
      },
    );
  };

  componentWillMount() {
    this.loginHeight = new Animated.Value(250);
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardWillHide,
    );
    this.keyboardHeight = new Animated.Value(100);
    this.forwardArrowOpacity = new Animated.Value(0);
    this.borderBottomWidth = new Animated.Value(0);
  }
  keyboardWillShow = event => {
    let duration = 0;
    if (Platform.OS == 'android') {
      duration = 100;
    } else {
      duration = event.duration;
    }
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: duration + 100,
        toValue: event.endCoordinates.height + 40,
      }),
      Animated.timing(this.forwardArrowOpacity, {
        duration: duration,
        toValue: 1,
      }),
      Animated.timing(this.borderBottomWidth, {
        duration: duration,
        toValue: 1,
      }),
    ]).start();
  };
  keyboardWillHide = event => {
    let duration = 0;
    if (Platform.OS == 'android') {
      duration = 100;
    } else {
      duration = event.duration;
    }
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: duration + 100,
        toValue: 100,
      }),
      Animated.timing(this.borderBottomWidth, {
        duration: duration,
        toValue: 0,
      }),
    ]).start();
  };
  increaseHeightOfLogin = box => {
    this.setState({preventEvents: true});
    Animated.timing(this.loginHeight, {
      toValue: height,
      timing: 500,
    }).start(() => {
      if (box == 'email') {
        this.refs.emailInput.focus();
      } else if (box == 'password') {
        this.refs.passwordInput.focus();
      }
    });
  };
  decreaseHeightOfLogin = () => {
    Keyboard.dismiss();
    Animated.timing(this.forwardArrowOpacity, {
      duration: 100,
      toValue: 0,
    }).start();
    this.setState({preventEvents: false});

    Animated.timing(this.loginHeight, {
      toValue: 250,
      timing: 500,
    }).start();
  };
  render() {
    const headerTextOpacity = this.loginHeight.interpolate({
      inputRange: [150, height],
      outputRange: [1, 0],
    });
    const marginTop = this.loginHeight.interpolate({
      inputRange: [150, height],
      outputRange: [25, 60],
    });
    const headerBackArrowOpacity = this.loginHeight.interpolate({
      inputRange: [150, height],
      outputRange: [0, 1],
    });
    const animateHeight = this.loginHeight.interpolate({
      inputRange: [150, height],
      outputRange: [-11.5, 50],
    });
    const animateLogoHeight = this.loginHeight.interpolate({
      inputRange: [150, height],
      outputRange: [150, 0],
    });
    const titleTextLeft = this.loginHeight.interpolate({
      inputRange: [150, height],
      outputRange: [100, 25],
    });
    const titleTextBottom = this.loginHeight.interpolate({
      inputRange: [150, 400, height],
      outputRange: [0, 0, 100],
    });
    const titleTextOpacity = this.loginHeight.interpolate({
      inputRange: [150, height],
      outputRange: [-1, 1],
    });

    return (
      <View style={{flex: 1}}>
        <Dialog
          dialogStyle={{
            position: 'absolute',
            bottom: 10,
            top: '35%',
          }}
          width={1}
          height={300}
          visible={this.state.social_modal}
          dialogTitle={<DialogTitle title="Social Login" />}
          footer={
            <DialogFooter>
              <DialogButton
                text="Cancel"
                onPress={() => this.setState({social_modal: false})}
              />
            </DialogFooter>
          }
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'bottom',
            })
          }>
          <DialogContent style={{paddingTop: '7%', height: '60%'}}>
            <Button
              style={{
                borderRadius: 5,
                justifyContent: 'space-between',

                width: '95%',
                marginLeft: '5%',
                backgroundColor: '#4267b2',
                marginTop: '0%',
                height: 45,
                paddingBottom: '4%',
              }}
              onPress={() => this.fbLogIn()}>
              <Icon name="logo-facebook" style={{fontSize: 35}} />
              <View style={{paddingRight: '20%'}}>
                <Text style={{fontSize: 20, color: 'white'}}>
                  {' '}
                  Facebook Login
                </Text>
              </View>
            </Button>
            <GoogleSigninButton
              style={{
                justifyContent: 'center',
                height: 55,
                width: '98%',
                marginLeft: '4%',
                marginTop: '8%',
                borderRadius: 5,
                paddingBottom: '4%',
              }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={this._signIn}
              disabled={this.state.isSigninInProgress}
            />
          </DialogContent>
        </Dialog>
        <Animated.View
          style={{
            height: animateHeight,
            width: 100,
            top: 15,
            left: 25,
            zIndex: 100,
            opacity: headerBackArrowOpacity,
          }}>
          <TouchableOpacity onPress={() => this.decreaseHeightOfLogin()}>
            <Icon name="md-arrow-back" style={{color: 'black'}} />
          </TouchableOpacity>
        </Animated.View>

        <ImageBackground
          source={require('../assets/login.jpg')}
          style={{flex: 1}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Animatable.View
              animation="zoomIn"
              iterationCount={1}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 100,
                width: 100,
              }}>
              <Animatable.Image
                style={{height: animateLogoHeight, width: 120}} //borderRadius: 400/ 2
                source={require('../assets/logo1.png')}></Animatable.Image>
            </Animatable.View>
          </View>
          {/* Bottom Half */}
          <Animatable.View animation="slideInUp" iterationCount={1}>
            <View>
              <Animated.View
                style={{height: this.loginHeight, backgroundColor: 'white'}}>
                <Animated.View
                  style={{
                    opacity: headerTextOpacity,
                    alignItems: 'flex-start',
                    paddingHorizontal: 25,
                    marginTop: marginTop,
                  }}>
                  <Text
                    style={{fontSize: 24, color: 'black', fontStyle: 'italic'}}>
                    Achieve Success With Us
                  </Text>
                </Animated.View>
                <Animated.View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}>
                  <Animated.View style={{marginBottom: '2%'}}>
                    <Animated.Text
                      style={{
                        fontSize: 24,
                        color: 'gray',
                        opacity: this.state.loading ? 1 : titleTextOpacity,
                      }}>
                      {this.state.loading == true
                        ? 'Logging In ...'
                        : 'Enter Your Credientials'}{' '}
                    </Animated.Text>
                  </Animated.View>
                  {this.state.loading == true ? (
                    <Spinner color="blue" />
                  ) : (
                    <></>
                  )}
                </Animated.View>
                <TouchableOpacity
                  onPress={() => this.increaseHeightOfLogin('email')}>
                  <View
                    style={{
                      marginTop: 0,
                      paddingHorizontal: 25,
                      flexDirection: 'row',
                    }}>
                    <Animated.View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        borderBottomWidth: this.borderBottomWidth,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      pointerEvents={
                        this.state.preventEvents === false ? 'none' : 'auto'
                      }>
                      <Icon name="md-mail" style={{marginRight: '3%'}} />
                      <TextInput
                        ref="emailInput"
                        onChangeText={text => this.setState({email: text})}
                        style={{flex: 1, fontSize: 20}}
                        placeholder="Enter Your Email"
                        underlineColorAndroid="transparent"
                        keyboardType="email-address"
                      />
                    </Animated.View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.increaseHeightOfLogin('password')}>
                  <View
                    style={{
                      marginTop: 25,
                      paddingHorizontal: 25,
                      flexDirection: 'row',
                    }}>
                    <Animated.View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        borderBottomWidth: this.borderBottomWidth,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      pointerEvents={
                        this.state.preventEvents === false ? 'none' : 'auto'
                      }>
                      <Icon name="md-lock" style={{marginRight: '4%'}} />
                      <TextInput
                        ref="passwordInput"
                        onChangeText={text => this.setState({password: text})}
                        style={{flex: 1, fontSize: 20}}
                        placeholder="Enter Your Password"
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                      />
                    </Animated.View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                height: 70,
                backgroundColor: 'white',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTopColor: '#e8e8ec',
                borderTopWidth: 1,
                paddingHorizontal: 25,
              }}>
              <TouchableOpacity
                onPress={() => this.setState({social_modal: true})}>
                <Text style={{color: '#5a7fdf', fontWeight: 'bold'}}>
                  Or connect Using Social Account{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.fbLogIn}>
                <Icon name="logo-facebook" style={{color: '#4267b2'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this._signIn}>
                <Icon name="logo-google" style={{color: '#db3236'}} />
              </TouchableOpacity>
            </View>
          </Animatable.View>

          <Animated.View
            style={{
              position: 'absolute',
              height: 60,
              width: 60,
              right: 10,
              bottom: this.keyboardHeight,
              opacity: this.forwardArrowOpacity,
              zIndex: 100,
              backgroundColor: '#54575e',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}>
            <TouchableOpacity onPress={this.handleLogIn}>
              <Icon name="md-arrow-forward" style={{color: 'white'}} />
            </TouchableOpacity>
          </Animated.View>
        </ImageBackground>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.loading}
          onRequestClose={() => alert('Closed')}>
          <View style={{paddingTop: '80%'}}>
            <DotIndicator color="white" animationDuration={800} count={4} />
          </View>
        </Modal>
      </View>
    );
  }
}
