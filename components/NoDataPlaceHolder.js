import React from 'react';
import {
  Card,
  CardItem,
  ListItem,
  Left,
  Body,
  Thumbnail,
  Text
} from 'native-base';
import { PulseIndicator } from 'react-native-indicators';

export default NoDataPlaceHolder = props => {
  return (
    <Card>
      <ListItem thumbnail>
        <Left>
          <Thumbnail square source={require('../assets/sad.png')} />
        </Left>
        <Body>
          <Text style={{ fontSize: 20 }}>{props.message}</Text>
        </Body>
      </ListItem>
      <CardItem>
        <Left>
          <PulseIndicator color='red' size={20} />
        </Left>
        <Body>
          <Text> </Text>
        </Body>
      </CardItem>
    </Card>
  );
};
