import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

import { Badge } from 'native-base';
import { DataProvider, LayoutProvider } from 'recyclerlistview';

const ViewTypes = {
  HALF_RIGHT: 2
};

export default class RecycleTestComponent extends React.Component {
  constructor(args) {
    super(args);

    let { width } = Dimensions.get('window');

    //Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
    //THIS IS VERY IMPORTANT, FORGET PERFORMANCE IF THIS IS MESSED UP
    let dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });

    //Create the layout provider
    //First method: Given an index return the type of item e.g ListItemType1, ListItemType2 in case you have variety of items in your list/grid
    //Second: Given a type and object set the exact height and width for that type on given object, if you're using non deterministic rendering provide close estimates
    //If you need data based check you can access your data provider here
    //You'll need data in most cases, we don't provide it by default to enable things like data virtualization in the future
    //NOTE: For complex lists LayoutProvider will also be complex it would then make sense to move it to a different file
    this._layoutProvider = new LayoutProvider(
      index => {
        return ViewTypes.HALF_RIGHT;
      },
      (type, dim) => {
        switch (type) {
          case ViewTypes.HALF_RIGHT:
            dim.width = width / 5;
            dim.height = 30;
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      }
    );

    this._rowRenderer = this._rowRenderer.bind(this);

    //Since component should always render once data has changed, make data provider part of the state
    this.state = {
      dataProvider: dataProvider.cloneWithRows(this._generateArray(300))
    };
  }

  _generateArray(n) {
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
      arr[i] = i;
    }
    return arr;
  }

  //Given type and data return the view component
  _rowRenderer(type, data) {
    //You can return any view here, CellContainer has no special significance
    switch (type) {
      case ViewTypes.HALF_RIGHT:
        return (
          <TouchableOpacity
            hitSlop={{ top: 12, left: 36, bottom: 0, right: 0 }}
            style={{
              paddingTop: '10%',
              paddingLeft: '25%',
              paddingBottom: '10%'
            }}
            onPress={() => {
              alert('click');
            }}
          >
            <Badge primary>
              <Text style={{ color: 'white', paddingTop: 2 }}>{data}</Text>
            </Badge>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          var options = {
            description: 'AAA Academy',
            currency: 'INR',
            key: 'rzp_live_6u3uJBhlBfbhhw',
            amount: '100'
          };
          RazorpayCheckout.open(options)
            .then(data => {
              // handle success
              alert(`Success: ${data.razorpay_payment_id}`);
            })
            .catch(error => {
              // handle failure
              alert(`Error: ${error.code} | ${error.description}`);
            });
        }}
      >
        <Text style={{ color: 'black' }}> Pay Here (RazorPay) </Text>
      </TouchableHighlight>
    );
  }
}

const styles = {
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#00a1f1'
  },
  containerGridLeft: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white'
  }
};
