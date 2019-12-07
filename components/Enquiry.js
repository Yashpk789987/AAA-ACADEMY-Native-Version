import React from 'react';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
  SlideAnimation
} from 'react-native-popup-dialog';
import { baseurl, endurl } from '../baseurl';
import { Form, Label, Input, Text, Item } from 'native-base';
import { Keyboard, Dimensions, AsyncStorage } from 'react-native';

export default class Enquiry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      mobile_no: '',
      address: '',
      keyboardSpace: 0,
      message: '',
      enquiry_done: ''
    };
    Keyboard.addListener('keyboardDidShow', frames => {
      if (!frames.endCoordinates) return;
      this.setState({ keyboardSpace: frames.endCoordinates.height });
    });
    Keyboard.addListener('keyboardDidHide', frames => {
      this.setState({ keyboardSpace: 0 });
    });
  }

  upload_enquiry_data = () => {
    this.setState({ uploading_data: true, message: 'Please Wait....' });
    let { name, mobile_no, address } = this.state;
    if (name === '' || mobile_no === '' || address === '') {
      this.setState({
        message: 'Please Fill All fields',
        uploading_data: false
      });
    } else {
      fetch(`${baseurl}enquiry/submit/${endurl}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then(res => res.json())
        .then(async data => {
          this.setState({ loading: false });
          if (data.code === 'enquiry_submit_success') {
            this.setState({ enquiry_done: 'done' });
            AsyncStorage.setItem('ENQUIRY', 'ENQUIRY_DONE');
          } else {
            alert('Server Error');
          }
        })
        .catch(err => {
          alert('Technical Error');
          this.setState({ loading: false });
        });
    }
  };

  render() {
    let screen_height = Dimensions.get('screen').height;
    return (
      <Dialog
        dialogStyle={{
          position: 'absolute',
          bottom: 0,
          top: 20
        }}
        width={1}
        height={400}
        visible={
          this.state.enquiry_done === 'done' ? false : this.props.do_enquiry
        }
        dialogTitle={<DialogTitle title='Your Introduction' />}
        footer={
          <DialogFooter>
            <DialogButton
              text='Submit'
              onPress={() => this.upload_enquiry_data()}
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
              <Label>Your Name </Label>
              <Input onChangeText={text => this.setState({ name: text })} />
            </Item>
            <Item stackedLabel>
              <Label>Mobile No </Label>
              <Input
                keyboardType={'numeric'}
                onChangeText={text => this.setState({ mobile_no: text })}
              />
            </Item>
            <Item stackedLabel>
              <Label>Address </Label>
              <Input onChangeText={text => this.setState({ address: text })} />
            </Item>
          </Form>
          <Text
            style={{
              color: this.state.uploading_data ? 'green' : 'red',
              paddingLeft: '5%'
            }}
          >
            {`\n`}
            {this.state.message}
          </Text>
        </DialogContent>
      </Dialog>
    );
  }
}
