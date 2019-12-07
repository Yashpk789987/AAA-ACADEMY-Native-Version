import React from 'react';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle,
  SlideAnimation
} from 'react-native-popup-dialog';
import { TouchableOpacity, Dimensions } from 'react-native';
import { Badge, Text, View, Spinner } from 'native-base';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider
} from 'recyclerlistview';
import TestMenuColorCode from '../../TestMenuColorCode';

const ViewTypes = {
  HALF_RIGHT: 2
};

export default class Menu extends React.Component {
  constructor(props) {
    super(props);

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
            dim.height = 40;
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      }
    );

    this._rowRenderer = this._rowRenderer.bind(this);

    this.state = {
      loading: true,
      dataProvider: dataProvider.cloneWithRows(
        this._generateArray(this.props.question_array)
      )
    };
  }

  _generateArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].index = i + 1;
    }
    return arr;
  }

  _rowRenderer(type, data) {
    switch (type) {
      case ViewTypes.HALF_RIGHT:
        if (data.index === this.props.current_index) {
          return (
            <TouchableOpacity
              style={{
                paddingTop: '10%',
                paddingLeft: '40%',
                paddingBottom: '10%'
              }}
              onPress={() => {
                this.props.Jump(data.index - 1);
              }}
            >
              <Badge warning>
                <Text style={{ color: 'white', paddingTop: 1, width: null }}>
                  {data.index}
                </Text>
              </Badge>
            </TouchableOpacity>
          );
        } else if (
          this.props.visited_questions_array.indexOf(data.index) !== -1 &&
          data.is_attempted === false
        ) {
          return (
            <TouchableOpacity
              style={{
                paddingTop: '10%',
                paddingLeft: '40%',
                paddingBottom: '10%'
              }}
              onPress={() => {
                this.props.Jump(data.index - 1);
              }}
            >
              <Badge danger>
                <Text style={{ color: 'white', paddingTop: 1, width: null }}>
                  {data.index}
                </Text>
              </Badge>
            </TouchableOpacity>
          );
        } else if (data.is_attempted === true) {
          return (
            <TouchableOpacity
              style={{
                paddingTop: '10%',
                paddingLeft: '40%',
                paddingBottom: '10%'
              }}
              onPress={() => {
                this.props.Jump(data.index - 1);
              }}
            >
              <Badge success>
                <Text style={{ color: 'white', paddingTop: 1, width: null }}>
                  {data.index}
                </Text>
              </Badge>
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              style={{
                paddingTop: '10%',
                paddingLeft: '40%',
                paddingBottom: '10%'
              }}
              onPress={() => {
                this.props.Jump(data.index - 1);
              }}
            >
              <Badge primary>
                <Text style={{ color: 'white', paddingTop: 1, width: null }}>
                  {data.index}
                </Text>
              </Badge>
            </TouchableOpacity>
          );
        }

      default:
        return null;
    }
  }

  componentWillReceiveProps = async props => {
    await this.setState({ loading: true });
    setTimeout(() => this.setState({ loading: false }), 2000);
  };

  render() {
    let dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });
    return (
      <Dialog
        width={1}
        height={0.8}
        visible={this.props.open_menu}
        dialogTitle={<TestMenuColorCode />}
        footer={
          <DialogFooter>
            <DialogButton
              text='CANCEL'
              onPress={() => {
                this.props.close_menu();
              }}
            />
            <DialogButton
              text='OK'
              onPress={() => {
                this.props.close_menu();
              }}
            />
          </DialogFooter>
        }
        dialogAnimation={
          new SlideAnimation({
            slideFrom: 'right'
          })
        }
      >
        <DialogContent style={{ paddingTop: '4%', height: '70%' }}>
          {this.state.loading === true ? <Spinner color='blue' /> : <></>}
          <RecyclerListView
            layoutProvider={this._layoutProvider}
            dataProvider={dataProvider.cloneWithRows(
              this._generateArray(this.props.question_array)
            )}
            rowRenderer={this._rowRenderer}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
