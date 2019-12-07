import React from 'react';
import {
  Image,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import ProgressCircle from 'react-native-progress-circle';
import RNBackgroundDownloader from 'react-native-background-downloader';
import {
  Card,
  Container,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Button,
  Icon,
  Content,
  List,
  ListItem,
  Right
} from 'native-base';
import { baseurl, endurl } from '../../../baseurl';
import { ThemeContext } from '../../../GlobalContext';

import Dialog from 'react-native-dialog';

import ToastExample from '../../../ToastExample';
import { BallIndicator } from 'react-native-indicators';

export default class PdfComponent extends React.Component {
  state = {
    object: {},
    loading: false,
    total_data_to_loaded: 100,
    data_loaded: 0,
    offline: false,
    message: '',
    pdf_available: false,
    offline_pdfs: [],
    pdf_downloading: false,
    percent : 0
  };

  handleBack = () => {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type === 'none') {
        alert('No Internet Connection');
      } else {
        this.props.goBack();
      }
    });
  };

  handleOpen = pdf => {
    ToastExample.openPdf(String(`AAA_${pdf.english_name}.pdf`).toLowerCase());
  };

  componentDidMount = async () => {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type === 'none') {
        this.setState({ offline: true, loading: true });
        AsyncStorage.getItem('PDFS').then(data => {
          if (data === null) {
            alert('No Pdf Available');
            this.setState({
              message: 'No Pdf Downloads Are Available...',
              loading: false
            });
          } else {
            this.setState({ offline_pdfs: JSON.parse(data), loading: false });
          }
        });
      } else {
        this.setState({ loading: true });
        fetch(`${baseurl}pdf/get/${this.props.sub_category_id}/${endurl}`)
          .then(res => res.json())
          .then(data => {
            if (data.length === 0) {
              alert('Sorry...\nPdf Not Available');
              this.props.goBack();
            } else {
              this.setState({ object: data[0], loading: false });

              AsyncStorage.getItem('PDFS').then(folder => {
                if (folder !== null) {
                  let pdf_downloaded = JSON.parse(folder).filter(item => {
                    return item.sub_category_id === this.props.sub_category_id;
                  });
                  if (pdf_downloaded.length === 0) {
                    this.setState({ pdf_available: false });
                  } else {
                    let newObject = Object.assign(this.state.object, {
                      fileUri: pdf_downloaded[0].fileUri
                    });
                    this.setState({ pdf_available: true, object: newObject });
                  }
                } else {
                  this.setState({ pdf_available: false });
                }
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  
  handleDownload = async () => {
    await this.setState({ pdf_downloading: true});
    await this.setState({ percent : 0.25 })
    let task = RNBackgroundDownloader.download({
      id: `AAA`+this.state.object._id.toString(),
      url: `${baseurl}uploads/pdfs/${this.state.object.filename}`,
      destination: `${RNBackgroundDownloader.directories.documents}/${String(`AAA_${this.state.object.english_name}.pdf`).toLowerCase()}`
  }).begin(async (expectedBytes) => {
    await this.setState({ percent : 0.5 })
      console.log(`Going to download ${expectedBytes} bytes!`);
  }).progress((percent) => {
      this.setState({ percent : percent })
  }).done(async () => {
      this.setState({ pdf_downloading : false})
      this.handleOpen(this.state.object);
      let folder = await AsyncStorage.getItem('PDFS');
      if (folder === null) {
      let array = [];
      array.push({ ...this.state.object });
      await AsyncStorage.setItem('PDFS', JSON.stringify(array));
      this.handleOpen(this.state.object);
      this.setState({ pdf_available: true });
    } else {
      let array = JSON.parse(folder);
      array.push({ ...this.state.object});
      await AsyncStorage.setItem('PDFS', JSON.stringify(array));

      this.handleOpen(this.state.object);
      this.setState({ pdf_available: true });
    }
  }).error((error) => {
      console.log('Download canceled due to error: ', error);
  });
  }

  render() {
    const barWidth = Dimensions.get('screen').width - 30;
    if (this.state.offline === true) {
      return (
        <ThemeContext.Consumer>
          {theme => {
            return (
              <Container style={{ backgroundColor: theme.background }}>
                <TouchableOpacity
                  style={{
                    paddingLeft: '10%',
                    paddingBottom: '3%',
                    paddingTop: '3%'
                  }}
                  onPress={() => this.handleBack()}
                >
                  <Icon
                    name='arrow-back'
                    style={{ color: theme.text_color, alignSelf: 'flex-start' }}
                  />
                </TouchableOpacity>
                <Content>
                  <List>
                    {this.state.message === '' ? (
                      this.state.offline_pdfs.map((pdf, index) => {
                        return (
                          <TouchableOpacity key={index}>
                            <Card>
                              <ListItem thumbnail>
                                <Left>
                                  <Thumbnail
                                    square
                                    source={require('../../../assets/pdf.jpg')}
                                  />
                                </Left>
                                <Body>
                                  <Text>{pdf.english_name}</Text>
                                </Body>
                                <Right>
                                  <Button
                                    transparent
                                    onPress={() => {
                                      this.handleOpen(pdf);
                                    }}
                                  >
                                    <Text>Open Pdf</Text>
                                  </Button>
                                </Right>
                              </ListItem>
                            </Card>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text
                        style={{ color: theme.text_color, paddingLeft: '5%' }}
                      >
                        No Pdf Downloads Available
                      </Text>
                    )}
                  </List>
                </Content>
              </Container>
            );
          }}
        </ThemeContext.Consumer>
      );
    } else if (this.state.loading === true) {
      return (
        <ThemeContext.Consumer>
          {theme => {
            return (
              <BallIndicator
                style={{ padding: '5%' }}
                color={theme.spinner_color}
              />
            );
          }}
        </ThemeContext.Consumer>
      );
    } else if (this.state.offline === false) {
      return (
        <ThemeContext.Consumer>
          {theme => {
            return (
              <Container style={{ backgroundColor: theme.background }}>
                <TouchableOpacity
                  style={{
                    paddingLeft: '10%',
                    paddingBottom: '3%',
                    paddingTop: '3%'
                  }}
                  onPress={() => this.props.goBack()}
                >
                  <Icon
                    name='arrow-back'
                    style={{ color: theme.text_color, alignSelf: 'flex-start' }}
                  />
                </TouchableOpacity>
                <Card>
                  <CardItem>
                    <Left>
                      <Thumbnail
                        source={require('../../../assets/logo1.png')}
                      />
                      <Body>
                        <Text>{this.state.object.english_name}</Text>
                        <Text note>Pdf Worksheets</Text>
                      </Body>
                    </Left>
                  </CardItem>
                  <CardItem cardBody>
                    <Image
                      source={{
                        uri: `${baseurl}uploads/sub_category/${this.state.object.logo}`
                      }}
                      style={{ height: 200, width: null, flex: 1 }}
                    />
                  </CardItem>
                  <CardItem>
                    {this.state.pdf_available === true ? (
                      <Button
                        onPress={() => {
                          console.log(this.state.object);
                          this.handleOpen(this.state.object);
                        }}
                      >
                        <Text>Open Pdf</Text>
                      </Button>
                    ) : (
                      <Button onPress={() => this.handleDownload()}>
                        <Icon name='md-download' />
                        <Text>Download</Text>
                      </Button>
                    )}
                  </CardItem>
                </Card>
                <Dialog.Container
                  visible={this.state.pdf_downloading}
                  contentStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '35%',
                    paddingTop: '8%'
                  }}
                >
                  <ProgressCircle
                    percent={Math.floor(
                      (this.state.percent ) * 100
                    )}
                    radius={60}
                    borderWidth={8}
                    color='#3399FF'
                    shadowColor='#999'
                    bgColor='#fff'
                  >
                    <Text style={{ fontSize: 18 }}>{`${Math.floor(
                      (this.state.percent ) * 100
                    )}%`}</Text>
                    <Thumbnail
                      square
                      height={'80%'}
                      style={{ paddingBottom: '3%' }}
                      source={require('../../../assets/pdf.jpg')}
                    />
                  </ProgressCircle>
                </Dialog.Container>
              </Container>
            );
          }}
        </ThemeContext.Consumer>
      );
    } else {
      return (
        <ThemeContext.Consumer>
          {theme => {
            return (
              <BallIndicator
                style={{ padding: '5%' }}
                color={theme.spinner_color}
              />
            );
          }}
        </ThemeContext.Consumer>
      );
    }
  }
}
