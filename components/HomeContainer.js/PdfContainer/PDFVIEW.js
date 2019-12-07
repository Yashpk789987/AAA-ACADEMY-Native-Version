import React from 'react';
import {
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity
} from 'react-native';
// import PDFReader from 'rn-pdf-reader-js';
import { Container, Header, Left, Body, Icon, Text } from 'native-base';
import { ThemeContext } from '../../../GlobalContext';
export default class PDFVIEW extends React.Component {
  state = {};
  static navigationOptions = {
    header: null
  };
  render() {
    const pdf = this.props.navigation.getParam('pdf');
    return (
      <ThemeContext.Consumer>
        {theme => {
          return (
            <Container style={{ flex: 1, backgroundColor: theme.background }}>
              <Header
                style={[
                  styles.androidHeader,
                  { backgroundColor: theme.header_background_color }
                ]}
              >
                <Left>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                  >
                    <Icon
                      name='arrow-back'
                      style={{ color: 'white', paddingLeft: '20%' }}
                    />
                  </TouchableOpacity>
                </Left>
                <Body
                  style={{
                    flex: 3,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 19 }}>
                    {pdf.english_name}
                  </Text>
                </Body>
              </Header>
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
