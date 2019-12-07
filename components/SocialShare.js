import React from 'react';
import {Linking, StyleSheet, View, Text} from 'react-native';
import {Button, Icon} from 'native-base';
export default class SocialShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleFacebookShare = () => {
    Linking.canOpenURL('fb://page/440691429603048')
      .then(supported => {
        if (!supported) {
          Linking.openURL('https://www.facebook.com/AAA.AcademyGwalior/');
        } else {
          Linking.openURL('fb://page/440691429603048');
        }
      })
      .catch(err => {
        Linking.openURL('https://www.facebook.com/AAA.AcademyGwalior/');
      });
  };

  whatsapp = () => {
    Linking.openURL(
      'whatsapp://send?text=hello sir , i want to enquire about your coaching &phone=+917566642636',
    );
  };

  instagram = () => {
    Linking.openURL('instagram://user?username=shshagrawal05');
  };

  twitter = () => {
    Linking.canOpenURL('twitter://user?screen_name=[ashisha72185401]')
      .then(supported => {
        if (!supported) {
          Linking.openURL('https://www.twitter.com/ashisha72185401');
        } else {
          Linking.openURL('twitter://user?screen_name=ashisha72185401');
        }
      })
      .catch(err => {
        Linking.openURL('https://www.twitter.com/ashisha72185401');
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            style={{backgroundColor: '#3b5998'}}
            title="Button 1"
            onPress={() => this.handleFacebookShare()}>
            <Icon name="logo-facebook" />
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={{backgroundColor: '#25D366'}}
            onPress={this.whatsapp}
            title="Button 1">
            <Icon name="logo-whatsapp" />
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={{backgroundColor: '#E1306C'}}
            onPress={this.instagram}
            title="Button 1">
            <Icon name="logo-instagram" />
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={{backgroundColor: '#00acee'}}
            onPress={this.twitter}
            title="Button 1">
            <Icon name="logo-twitter" />
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginTop: '5%',
    marginLeft: '5%',
  },
  buttonContainer: {},
});
