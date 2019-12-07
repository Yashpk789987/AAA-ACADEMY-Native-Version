import React from 'react';
import { Icon } from 'native-base';
import BottomNavigation, {
  FullTab
} from 'react-native-material-bottom-navigation';

export default class BottomToolBar extends React.Component {
  tabs = [
    {
      key: 'move_backward',
      icon: 'rewind',
      label: 'Move Backward',
      barColor: this.props.toolbar_background_color
    },
    {
      key: 'move_forward',
      icon: 'fastforward',
      label: 'Move Forward',
      barColor: this.props.toolbar_background_color
    },
    {
      key: 'movies-tv',
      icon: 'share-alt',
      label: 'share',
      barColor: this.props.toolbar_background_color
    }
  ];

  renderIcon = icon => ({ isActive }) => (
    <Icon size={24} style={{ color: 'white' }} name={icon} />
  );

  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={true}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
  );

  onTabClick = async newTab => {
    let props = this.props;
    switch (newTab.key) {
      case 'move_forward':
        props.moveForward();
        break;
      case 'move_backward':
        props.moveBackward();
        break;
      case 'share':
        // UNDO OPERATION
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <BottomNavigation
        onTabPress={newTab => {
          this.onTabClick(newTab);
        }}
        renderTab={this.renderTab}
        tabs={this.tabs}
      />
    );
  }
}
