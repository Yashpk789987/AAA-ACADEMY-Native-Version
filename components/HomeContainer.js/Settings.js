import React, { Component } from 'react';
import {
  Switch,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity
} from 'react-native';
import {
  Container,
  Header,
  Content,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Button
} from 'native-base';
import { ThemeContext } from '../../GlobalContext';

export default class Settings extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    switch_value: false
  };

  handleSwitch = () => {
    this.setState(state => ({ switch_value: !state.switch_value }));
    this.props.screenProps.toggleTheme();
  };

  componentDidMount() {}
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
                    onPress={() => this.props.navigation.goBack()}
                    hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
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
                  <Text style={{ color: 'white', fontSize: 19 }}>Settings</Text>
                </Body>
                <Right />
              </Header>
              <Content>
                <ListItem icon bordered>
                  <Left>
                    <Button
                      style={{ backgroundColor: theme.header_background_color }}
                    >
                      <Icon
                        active
                        name={theme.name === 'light' ? 'sunny' : 'moon'}
                      />
                    </Button>
                  </Left>
                  <Body>
                    <Text style={{ color: theme.text_color }}>
                      {theme.name === 'light'
                        ? 'Switch To Dark Theme'
                        : 'Switch To Light Theme'}
                    </Text>
                  </Body>
                  <Right>
                    <Switch
                      value={theme.name === 'dark' ? true : false}
                      trackColor={{ true: 'white', false: 'blue' }}
                      thumbColor={theme.name === 'dark' ? 'white' : 'blue'}
                      onValueChange={() => this.handleSwitch()}
                    />
                  </Right>
                </ListItem>
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
