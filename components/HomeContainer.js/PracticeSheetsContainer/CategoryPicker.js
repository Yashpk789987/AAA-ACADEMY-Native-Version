import React from 'react'
import { ScrollView , Text , StyleSheet , Platform , StatusBar , TouchableOpacity , Image } from 'react-native'
import { Container , Header , Left, Right, Body, Icon , Button , Card , CardItem , Spinner, Content , Grid , Col, Row} from 'native-base'

import { GlobalContext , ThemeContext } from '../../../GlobalContext'
import { createMaterialTopTabNavigator , createAppContainer } from 'react-navigation'
import { baseurl , endurl , file_base_url} from '../../../baseurl'
import { BallIndicator } from 'react-native-indicators'

class AptitudeCategoryPicker extends React.Component {
    static navigationOptions = {
        header : null,
    }
    constructor(props){
        super(props);
        this.state = {
            "categories" : [],
            "aptitude_categories_loading" : true,
        }
    }

    componentDidMount() {
        fetch(baseurl + `categories_and_sub_categories/sub_categories/1/${endurl}`)
        .then((res) => res.json())
        .then((data) => { this.setState({ aptitude_categories_loading : false , categories : data})})
        .catch((err) => console.log(err))
    }

    handleCategoryClick = (category , stackNavigatorRef) => {
       stackNavigatorRef.navigate('PracticeSheetComponent' , { sub_category_id : category._id , sub_category_name : category.english_name })
    }

    
    
    makeCategories = (theme, stackNavigatorRef) => {
        let categories = this.state.categories;
        categories_components = []
        for( let i = 0 ; i < categories.length ; i = i + 2){
            categories_components.push(
                <Row key = {i}  > 
                    <TouchableOpacity style = {{ flex  : 1  , padding : "1%"}} onPress = {() => this.handleCategoryClick(categories[i] , stackNavigatorRef)} >
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
                    <TouchableOpacity style = {{ flex  : 1  , padding : "1%"}} onPress = {() => this.handleCategoryClick(categories[i+1] , stackNavigatorRef)} >
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
        return(
            <ThemeContext.Consumer>
            { (theme) => { return (    
            <Container style = {{ backgroundColor : theme.background }}>
                <ScrollView >
                {   
                    (this.state.aptitude_categories_loading ? <BallIndicator style = {{ padding : '5%'}} color={theme.spinner_color} /> :
                        <GlobalContext.Consumer>
                            {({stackNavigatorRef}) => {return(
                                this.makeCategories(theme.button_background_color , stackNavigatorRef)
                            )}}
                        </GlobalContext.Consumer>
                    )
                }
                </ScrollView> 
            </Container>
            )}}
            </ThemeContext.Consumer>
        )
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
        }
    }

    handleCategoryClick = (category , stackNavigatorRef) => {
        stackNavigatorRef.navigate('PracticeSheetComponent' , { sub_category_id : category._id , sub_category_name : category.english_name})
    }

    componentDidMount() {
        fetch(baseurl + 'categories_and_sub_categories/sub_categories/2' + '/' + endurl)
        .then((res) => res.json())
        .then((data) => { this.setState({ reasoning_categories_loading : false , categories : data})})
        .catch((err) => console.log(err))
    }
    
    makeCategories = (theme, stackNavigatorRef) => {
        let categories = this.state.categories;
        categories_components = []
        for( let i = 0 ; i < categories.length ; i = i + 2){
            categories_components.push(
                <Row key = {i}  > 
                    <TouchableOpacity style = {{ flex  : 1  , padding : "1%"}} onPress = {() => this.handleCategoryClick(categories[i] , stackNavigatorRef)} >
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
                    <TouchableOpacity style = {{ flex  : 1  , padding : "1%"}} onPress = {() => this.handleCategoryClick(categories[i+1], stackNavigatorRef)} >
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
        return(
            
            <ThemeContext.Consumer>
            { (theme) => { return (    
            <Container style = {{ backgroundColor : theme.background }}>
               <ScrollView >
                {   
                    (this.state.reasoning_categories_loading ? <BallIndicator style = {{ padding : '5%'}} color={theme.spinner_color} />: 
                    <GlobalContext.Consumer>
                        {({stackNavigatorRef}) => {return(
                            this.makeCategories(theme.button_background_color , stackNavigatorRef)
                        )}}
                        
                    </GlobalContext.Consumer>
                    )
                }
                </ScrollView> 
            </Container>
            )}}
            </ThemeContext.Consumer>
        )
    }
}



const  CategoryTabs = createMaterialTopTabNavigator({ 
    'Aptitude' : {
        screen : (props) => <AptitudeCategoryPicker  />
    } , 
    'Reasoning' : {
        screen : (props) => <ReasoningCategoryPicker  />
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

export default class CategoryPicker extends React.Component {
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
                <GlobalContext.Provider value = {{stackNavigatorRef : this.props.navigation}} >
                  <CategoryTabContainer  />
                </GlobalContext.Provider>  
            </Container>
            
            )}}
            </ThemeContext.Consumer>
        )
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
});﻿
  