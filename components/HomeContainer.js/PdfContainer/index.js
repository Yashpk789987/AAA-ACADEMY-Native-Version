

import React from 'react'
import { ScrollView , Text , StyleSheet , Platform , StatusBar , TouchableOpacity , Image , RefreshControl, AsyncStorage  } from 'react-native'
import {Container , Header , Left, Right, Body, Icon , Button , Card , CardItem ,  Col, Row} from 'native-base'
import { GlobalContext , ThemeContext } from '../../../GlobalContext'
import { createMaterialTopTabNavigator , createAppContainer , createStackNavigator } from 'react-navigation'
import { baseurl , endurl , file_base_url} from '../../../baseurl'
import PdfComponent from './PdfComponent.js'
import PDFVIEW from './PDFVIEW.js'
import { BallIndicator } from 'react-native-indicators'
import NetInfo from "@react-native-community/netinfo";

class AptitudeCategoryPicker extends React.Component {
    
    static navigationOptions = {
        header : null,
    }

    constructor(props){
        super(props);
        this.state = {
            "categories" : [],
            "aptitude_categories_loading" : true,
            sub_category_id : 0,
            offline : false
        }
    }


    check_if_online = () => {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type === 'none'){
                return false
            } else {
                return true
            }
        });
    }


    load = async () => {
        this.setState({ aptitude_categories_loading : true })
        let student_id = JSON.parse(await AsyncStorage.getItem('student'))._id;
        fetch(baseurl + `categories_and_sub_categories/fetch_sub_category_for_pdf/${student_id}/1/${endurl}`)
        .then((res) => res.json())
        .then((data) => { this.setState({ aptitude_categories_loading : false , categories : data})})
        .catch((err) => console.log(err))
    }

    componentDidMount() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type === 'none'){
                this.setState({ offline : true })
            } else {
                this.load()
            }
        });
    }

    handleCategoryClick = (category_id) => {
       this.setState({ sub_category_id : category_id })
    }

    goBack = () => {
        this.setState({ sub_category_id : 0 , offline : false })
        this.load()
    }
    
    makeCategories = (theme) => {
        let categories = this.state.categories;
        categories_components = []
        for( let i = 0 ; i < categories.length ; i = i + 2){
            categories_components.push(
                <Row key = {i}  > 
                    <TouchableOpacity style = {{ flex  : 1  , padding : "1%"}} onPress = {() => this.handleCategoryClick(categories[i]._id)} >
                    <Col  >
                        <Card style={{flex: 0 }}>
                            <CardItem>
                                <Body style = {{ flex : 3, justifyContent : 'center', alignItems : 'center'}}>
                                    <Text style = {{ fontSize : 15 }} adjustsFontSizeToFit = {true} numberOfLines = {2}>{categories[i].english_name}</Text>
                                </Body>
                            </CardItem>
                            <CardItem cardBody>
                                <Image source={{uri: file_base_url + '/sub_category/' + categories[i].logo }} style={{height: 200, width: null, flex : 1 }}/> 
                            </CardItem>
                        </Card>
                    </Col>
                    </TouchableOpacity>
                    { (i+1) === categories.length ? <Col></Col> : 
                    <TouchableOpacity style = {{ flex  : 1  , padding : "1%"}} onPress = {() => this.handleCategoryClick(categories[i+1]._id)} >
                    <Col  >
                        <Card style={{flex: 0 }}>
                            <CardItem>
                                <Body style = {{ flex : 3, justifyContent : 'center', alignItems : 'center'}}>
                                    <Text style = {{ fontSize : 15 }} adjustsFontSizeToFit = {true} numberOfLines = {2}>{categories[i+1].english_name}</Text>
                                </Body>
                            </CardItem>
                            <CardItem cardBody>
                                <Image source={{uri: file_base_url + '/sub_category/' + categories[i+1].logo }} style={{height: 200, width: null, flex : 1 }}/> 
                            </CardItem>
                        </Card>
                    </Col>
                    </TouchableOpacity>
                    }
                </Row>
            )
        }
        return ( categories_components );
    }


    refresh_list = () => {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type === 'none'){
                this.setState({ offline : true })
            } else {
                this.load()
            }
        });
    };
    

    render() {
        if(this.state.sub_category_id  === 0 && this.state.offline === false){
            return(
                <ThemeContext.Consumer>
                { (theme) => { return (    
                <Container style = {{ backgroundColor : theme.background }}>
                <ScrollView refreshControl = { <RefreshControl
                                                refreshing={false}
                                                onRefresh={() => this.refresh_list()}
                                               />
                                            } 
                >
                        {   
                            (this.state.aptitude_categories_loading ? <BallIndicator style = {{ padding : '5%'}} color={theme.spinner_color} /> :
                                <GlobalContext.Consumer>
                                    {() => {return(
                                        this.makeCategories(theme.button_background_color)
                                    )}}
                                </GlobalContext.Consumer>
                            )
                        }
                </ScrollView>  
                </Container>
                )}}
                </ThemeContext.Consumer>
            )
        }else if(this.state.offline === true){
            return(
                <GlobalContext.Consumer>
                    {({stackNavigatorRef}) => {return(
                        <PdfComponent stackNavigatorRef = {stackNavigatorRef} goBack = {this.goBack} sub_category_id = {this.state.sub_category_id} />
                    )}}
                </GlobalContext.Consumer>
                
            )
        }else {
            return(
                <GlobalContext.Consumer>
                    {({stackNavigatorRef}) => {return(
                        <PdfComponent stackNavigatorRef = {stackNavigatorRef} goBack = {this.goBack} sub_category_id = {this.state.sub_category_id} />
                    )}}
                </GlobalContext.Consumer>
            )
        }
    }
}



class ReasoningCategoryPicker extends React.Component {
    static navigationOptions = {
        header : null,
    }
    constructor(props){
        super(props);
        this.state = {
            "categories" : [],
            "reasoning_categories_loading" : true,
            sub_category_id : 0,
            offline : false
        }
    }

    check_if_online = () => {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type === 'none'){
                return false;
            } else {
                return true;
            }
        });
    }

    load = async () => {
        this.setState({ reasoning_categories_loading : true })
        let student_id = JSON.parse(await AsyncStorage.getItem('student'))._id;
        fetch(baseurl + `categories_and_sub_categories/fetch_sub_category_for_pdf/${student_id}/2/${endurl}`)
        .then((res) => res.json())
        .then((data) => { this.setState({ reasoning_categories_loading : false , categories : data})})
        .catch((err) => console.log(err))
    }

    refresh_list = () => {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type === 'none'){
                this.setState({ offline : true })
            } else {
                this.load()
            }
        });
    };


    componentDidMount() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type === 'none'){
                this.setState({ offline : true })
            } else {
                this.load()
            }
        });
    }

    handleCategoryClick = (category_id) => {
        this.setState({ sub_category_id : category_id })
    }

    goBack = () => {
        this.setState({ sub_category_id : 0 , offline : false })
        this.load()
    }
    
    makeCategories = (theme) => {
        let categories = this.state.categories;
        categories_components = []
        for( let i = 0 ; i < categories.length ; i = i + 2){
            categories_components.push(
                <Row key = {i}  > 
                    <TouchableOpacity style = {{ flex  : 1  , padding : "1%"}} onPress = {() => this.handleCategoryClick(categories[i]._id)} >
                    <Col  >
                        <Card style={{flex: 0 }}>
                            <CardItem>
                                <Body style = {{ flex : 3, justifyContent : 'center', alignItems : 'center'}}>
                                    <Text style = {{ fontSize : 15 }} adjustsFontSizeToFit = {true} numberOfLines = {2}>{categories[i].english_name}</Text>
                                </Body>
                            </CardItem>
                            <CardItem cardBody>
                                <Image source={{uri: file_base_url + '/sub_category/' + categories[i].logo }} style={{height: 200, width: null, flex : 1 }}/> 
                            </CardItem>
                        </Card>
                    </Col>
                    </TouchableOpacity>
                    { (i+1) === categories.length ? <Col></Col> : 
                    <TouchableOpacity style = {{ flex  : 1  , padding : "1%"}} onPress = {() => this.handleCategoryClick(categories[i+1]._id)} >
                    <Col  >
                        <Card style={{flex: 0 }}>
                            <CardItem>
                                <Body style = {{ flex : 3, justifyContent : 'center', alignItems : 'center'}}>
                                    <Text style = {{ fontSize : 15 }} adjustsFontSizeToFit = {true} numberOfLines = {2}>{categories[i+1].english_name}</Text>
                                </Body>
                            </CardItem>
                            <CardItem cardBody>
                                <Image source={{uri: file_base_url + '/sub_category/' + categories[i+1].logo }} style={{height: 200, width: null, flex : 1 }}/> 
                            </CardItem>
                        </Card>
                    </Col>
                    </TouchableOpacity>
                    }
                </Row>
            )
        }
        return ( categories_components );
    }

    componentDidUpdate() {

    }

    render() {
        if(this.state.sub_category_id  === 0 && this.state.offline === false){
            return(
                <ThemeContext.Consumer>
                { (theme) => { return (    
                <Container style = {{ backgroundColor : theme.background }}>
                <ScrollView refreshControl = { <RefreshControl
                                                refreshing={false}
                                                onRefresh={() => this.refresh_list()}
                                               />
                                            }  >
                        {   
                            (this.state.reasoning_categories_loading ? <BallIndicator style = {{ padding : '5%'}} color={theme.spinner_color} /> :
                                <GlobalContext.Consumer>
                                    {() => {return(
                                        this.makeCategories(theme.button_background_color)
                                    )}}
                                </GlobalContext.Consumer>
                            )
                        }
                </ScrollView>  
                </Container>
                )}}
                </ThemeContext.Consumer>
            )
        }else if(this.state.offline === true){
            return(
                <GlobalContext.Consumer>
                    {({stackNavigatorRef}) => {return(
                        <PdfComponent stackNavigatorRef = {stackNavigatorRef} goBack = {this.goBack} sub_category_id = {this.state.sub_category_id} />
                    )}}
                </GlobalContext.Consumer>
                
            )
        }else {
            return(
                <GlobalContext.Consumer>
                    {({stackNavigatorRef}) => {return(
                        <PdfComponent stackNavigatorRef = {stackNavigatorRef} goBack = {this.goBack} sub_category_id = {this.state.sub_category_id} />
                    )}}
                </GlobalContext.Consumer>
            )
        }
    }
}



const  CategoryTabs = createMaterialTopTabNavigator({ 
    'Aptitude' : {
        screen : (props) => <AptitudeCategoryPicker {...props} />
    } , 
    'Reasoning' : {
        screen : (props) => <ReasoningCategoryPicker {...props} />
    }
} , {
    lazy : true ,
    tabBarOptions : {
        style : { backgroundColor : 'white'},
        activeTintColor : 'black',
        inactiveTintColor : 'grey',
        indicatorStyle : { opacity : 0}
    }
})

const CategoryTabContainer = createAppContainer(CategoryTabs)

class PdfContainer extends React.Component {
    static navigationOptions = { 
        header : null
    }
    
    render() {
        return(
            <ThemeContext.Consumer>
            { (theme) => { return (    
            <Container style = {{ backgroundColor : theme.background }}>
                <Header style={[styles.androidHeader , { backgroundColor: theme.header_background_color }]}>
                    <Left>
                       <GlobalContext.Consumer> 
                          { ({drawer_reference}) => { return (
                              <TouchableOpacity onPress = {() => drawer_reference.openDrawer()} hitSlop = {{top: 20, bottom: 20, left: 30, right: 30}}> 
                                <Icon name='menu' style = {{ color : 'white' , paddingLeft : "20%"}}  />
                              </TouchableOpacity>
                          )
                          }}
                       </GlobalContext.Consumer> 
                        
                    </Left>
                    <Body style = {{ flex : 3, justifyContent : 'center' , alignItems : 'center'}} >
                        <Text style = {{ color : 'white' , fontSize : 19 , paddingLeft : '26%'}}>Choose Topic</Text>
                    </Body>
                    <Right>
                          
                    </Right>
                </Header>
                <GlobalContext.Provider value = {{stackNavigatorRef : this.props.navigation}}>
                  <CategoryTabContainer theme = {theme} />
                </GlobalContext.Provider>  
            </Container>
            
            )}}
            </ThemeContext.Consumer>
        )
    }
}

const AppNavigator = createStackNavigator({
    PdfContainer : {
        screen : PdfContainer
    },
    PDFVIEW : {
        screen : PDFVIEW
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
 
 
 



const styles = StyleSheet.create({
    androidHeader: {
        ...Platform.select({
            android: {
                marginTop: 0,
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
});﻿
  