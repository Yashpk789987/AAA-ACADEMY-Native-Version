import React from 'react';

import { baseurl, endurl } from '../../../baseurl';

import { ThemeContext } from '../../../GlobalContext';
import LottieView from 'lottie-react-native';
import {
  AsyncStorage,
  StyleSheet,
  Platform,
  TouchableOpacity
} from 'react-native';

import {
  Container,
  Icon,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Left,
  Body,
  Right,
  Spinner,
  Thumbnail,
  Card
} from 'native-base';

import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
  SlideAnimation
} from 'react-native-popup-dialog';

export default class ShowAllPayments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      loading: false
    };
  }

  getPack = pack_id => {
    switch (pack_id) {
      case 1:
        return 'Silver';
      case 2:
        return 'Platinum';
      case 3:
        return 'Gold';
    }
  };

  findResourceUrl = pack_id => {
    switch (pack_id) {
      case 1:
        return `${baseurl}uploads/assets/silver.JPG`;
      case 2:
        return `${baseurl}uploads/assets/gold.JPG`;
      case 3:
        return `${baseurl}uploads/assets/platinum.JPG`;
    }
  };

  makePaymentList = theme => {
    return (
      <List>
        {this.state.payments.map((item, index) => {
          return (
            <Card key={index}>
              <ListItem thumbnail>
                <Left>
                  <Thumbnail
                    square
                    source={require('../../../assets/card.png')}
                    onError={error => alert(error)}
                  />
                </Left>
                <Body>
                  <Text style={{ color: 'black' }}>
                    {this.getPack(parseInt(item.payment_type))}
                  </Text>
                  <Text style={{ color: 'black' }} note>
                    Amount {item.amount} Rs
                  </Text>
                </Body>
                <Right>
                  <Right>
                    <Text style={{ color: 'black' }} note>
                      {item.payment_date}
                    </Text>
                  </Right>
                </Right>
              </ListItem>
            </Card>
          );
        })}
      </List>
    );
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    let { _id } = JSON.parse(await AsyncStorage.getItem('student'));
    fetch(`${baseurl}payment/showAllPayments/${_id}/${endurl}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ payments: data, loading: false });
      })
      .catch(err => {
        alert('Technical Error ');
      });
    if (this.props.open_confirm_dialog === true) {
      this.animation.play();
    }
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {theme => {
          return (
            <Container style={{ backgroundColor: theme.background }}>
              <Header
                style={[
                  styles.androidHeader,
                  { backgroundColor: theme.header_background_color }
                ]}
              >
                <Left>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.goBack();
                    }}
                    hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
                  >
                    <Icon
                      name='arrow-back'
                      style={{ color: 'white', paddingLeft: '20%' }}
                    />
                  </TouchableOpacity>
                </Left>
                <Body>
                  <Text style={{ color: 'white', fontSize: 19 }}>
                    All Payments{' '}
                  </Text>
                </Body>
                <Right />
              </Header>
              <Dialog
                width={1}
                height={0.5}
                dialogStyle={{ position: 'absolute' }}
                visible={this.props.open_confirm_dialog}
                dialogTitle={<DialogTitle title='Payment Confirmation' />}
                footer={
                  <DialogFooter>
                    <DialogButton
                      text='Ok'
                      onPress={() => {
                        this.props.refresh_payment_status(true);
                        this.props.goBack();
                        this.props.closeDialog();
                      }}
                    />
                  </DialogFooter>
                }
                dialogAnimation={
                  new SlideAnimation({
                    slideFrom: 'bottom'
                  })
                }
              >
                <DialogContent style={{ paddingTop: '2%', height: '50%' }}>
                  <Container>
                    <LottieView
                      ref={animation => {
                        this.animation = animation;
                      }}
                      source={require('../../../assets/tick.json')}
                    />
                  </Container>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    Your Payment Is Accepted
                  </Text>
                </DialogContent>
              </Dialog>
              <Content
                style={{
                  paddingTop: '8%'
                }}
              >
                {this.state.loading ? (
                  <Spinner color='white' />
                ) : (
                  this.makePaymentList(theme)
                )}
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
