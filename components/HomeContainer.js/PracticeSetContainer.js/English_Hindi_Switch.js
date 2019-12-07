import React from 'react';
import { Text } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';

export default class English_Hindi_Switch extends React.Component {
  state = {};
  componentDidMount() {}

  render() {
    return (
      <SwitchSelector
        initial={0}
        onPress={value => this.props.handleLanguageChange(value)}
        textColor={'purple'}
        selectedColor={'white'}
        buttonColor={'purple'}
        borderColor={'purple'}
        hasPadding
        options={[
          { label: 'A', value: 'english' },
          { label: 'अ', value: 'hindi' }
        ]}
      />
    );
  }
}
