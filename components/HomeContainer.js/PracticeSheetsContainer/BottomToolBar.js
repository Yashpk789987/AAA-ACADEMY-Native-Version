import React  from 'react'
import { View , Share , Text } from 'react-native'
import { Icon } from 'native-base'

import BottomNavigation, {
    FullTab
  } from 'react-native-material-bottom-navigation'
   
  export default class BottomToolBar extends React.Component {
    state = {
      activeTab : '',
      modal_visible : false
    }
    tabs = [
      {
        key: 'games',
        icon: 'bookmark',
        label: 'Bookmarks',
        barColor: this.props.toolbar_background_color,
        
      },
      {
        key: 'jump',
        icon: 'fastforward',
        label: 'Move To ',
        barColor: this.props.toolbar_background_color,
        
      },
      {
        key: 'share',
        icon: 'share-alt',
        label: 'share',
        barColor: this.props.toolbar_background_color,
      },
    ]
   
    renderIcon = icon => ({ isActive }) => (
      <Icon size={24} style = {{ color : 'white' }} name={icon} />
    )
   
    renderTab = ({ tab, isActive }) => (
      <FullTab
        isActive={isActive}
        key={tab.key}
        label={tab.label}
        renderIcon={this.renderIcon(tab.icon)}
      />
    )

    onTabClick = async (newTab) => {
      let props = this.props
      
      if(newTab.key === 'share'){
        this.onShare(props.question_array,props.current_index)
      }else if(newTab.key === 'jump'){
        this.props.makeModalVisible('question')
      }
    }
   
    makeMessage = (question,correct_index) => {
      let message = ``
      message += ` Q. ` + `${question.english_text} \n`
      for( let i = 0 ; i < question.options.length ; i++){
        message += ` \n ${i+1} . ` + `${question.options[i].option_english_text}`
      }
      message += `\n\nCorrect Option : ${correct_index} \n\n`
      return message ;
    }

    onShare = async (question_array,current_index) => {
      try {
        const result = await Share.share({
          message: this.makeMessage(question_array[current_index-1] , question_array[current_index-1].correct_option_index)
        })
  
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            
          } else {
            
          }
        } else if (result.action === Share.dismissedAction) {
          
        }
      } catch (error) {
        alert(error.message);
      }
    };

    jumpToQuestion = () => {
       this.setState({ modal_visible : true })
    }


    componentDidUpdate(){}

    render() {
      return (
        <BottomNavigation
          onTabPress={newTab => {this.onTabClick(newTab)}}
          renderTab={this.renderTab}
          tabs={this.tabs}
        />
      )
    }
  }