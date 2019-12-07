
import { createStackNavigator, createAppContainer } from "react-navigation";

import React from 'react'
import CategoryPicker from './CategoryPicker'
import PracticeSheetComponent from './PracticeSheetComponent'

import { GlobalContext } from '../../../GlobalContext'

const AppNavigator = createStackNavigator({
   CategoryPicker : {
       screen : CategoryPicker
   },
   PracticeSheetComponent : {
       screen : PracticeSheetComponent
   }
});

const AppContainer = createAppContainer(AppNavigator);

export default class  __ extends React.Component {
    static navigationOptions = { 
        header : null
    }
    render() {
        return(
          <GlobalContext.Provider value = {{ drawer_reference : this.props.navigation}}>
            <AppContainer />
          </GlobalContext.Provider>  
        )
    }
}



  