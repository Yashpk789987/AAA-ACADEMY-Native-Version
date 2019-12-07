import React from 'react'
import { FlatList, View , StyleSheet ,Dimensions, Platform , StatusBar , TouchableOpacity , ScrollView , Image , Modal , TouchableHighlight} from 'react-native'

import { ListItem , Badge, Row , Card , CardItem , Body , Left , Right ,Container, Header, Content, Text, Spinner , Icon , Button , Grid , Col , Input,Item } from 'native-base'
import { ThemeContext } from '../../../GlobalContext.js'
import { baseurl , endurl , file_base_url } from '../../../baseurl'
import Dialog, { DialogFooter, DialogButton, DialogContent , DialogTitle , SlideAnimation} from 'react-native-popup-dialog';
import BottomToolBar from './BottomToolBar'
import GestureRecognizer  from 'react-native-swipe-gestures';
var q = {} ;
const Entities = require('html-entities').XmlEntities;
 
const entities = new Entities();


class Custom_Badge extends React.Component {
    handleJump = (j) => {
        this.props.handleJump(j)
    }
    render(){
        const j = this.props.j
        return(
            <Col style={{ backgroundColor: 'white'}}  >
                <TouchableOpacity hitSlop={{top: 12, left: 36, bottom: 0, right: 0}}  onPress = {() => {this.handleJump(j)}}>
                  {this.props.current_index - 1 === j ? <Badge success><Text>{j + 1}</Text></Badge> :   <Badge primary><Text>{j + 1}</Text></Badge>}
                </TouchableOpacity>
            </Col>
        )
    }
}


class Question extends React.Component {
    state = {
       color_object : {
        correct_dynamic_color : '',
        correct_dynamic_color_2 : '',
       } , 
       clicked : false , 
       options : []
    }


    componentDidMount() {
       //let options = this.props.question.options.sort((a, b) => parseInt(a.option_id) - parseInt(b.option_id));
    }
    
    componentDidUpdate(){
       //this.props.question.options = this.props.question.options.sort((a, b) => parseInt(a.option_id) - parseInt(b.option_id));
    }

    handleCorrect = () => {
        let newObject = Object.assign(this.state.color_object , {
            correct_dynamic_color : 'green',
            correct_dynamic_color_2 : 'green',
        })
        this.setState({ color_object : newObject , clicked : true})
    }


    handleInCorrect = () => {
        let newObject = Object.assign(this.state.color_object , {
            correct_dynamic_color : 'green',
            correct_dynamic_color_2 : 'green',
        })
        this.setState({ color_object : newObject , clicked : true})
    } 

    handleSwip = (direction, state) => {
        let newObject = Object.assign(this.state.color_object , {
            correct_dynamic_color : '',
            correct_dynamic_color_2 : '',
        })
        this.setState({ color_object : newObject , clicked : false})
        this.props.handleSwip(direction, state)
    }

    render(){
        const question = this.props.question
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        let options = this.props.question.options.sort((a, b) => parseInt(a.option_id) - parseInt(b.option_id));
        return(
            <ThemeContext.Consumer>
                {(theme) => { return(
                    <GestureRecognizer
                      onSwipe={(direction, state) => {this.handleSwip(direction, state)}}
                      config={config}
                      style = {{ height : "72%"}}
                    >
                        <ScrollView  style = {{ padding : '5%', backgroundColor : theme.background , borderColor : theme.outline_color , borderWidth : 1, borderRadius : 5 }}>
                            <View>
                                <Text style = {{ color : theme.text_color , fontSize : 20}}>
                                    Q {this.props.index + 1} . {entities.decode(question.english_text)}{`\n`}{`\n`}{entities.decode(question.hindi_text)}
                                </Text>
                            </View>    
                            { question.pic === null ? <></> : 
                            <Image
                                    style={{
                                        height: Dimensions.get('window').height * 0.2,
                                        width :null,
                                        flex: 1,
                                        resizeMode: 'contain',
                                    }}
                                    source={{ uri : file_base_url + '/questions/' + question.pic }}
                                />
                            }
                            <View
                            style={{
                                paddingTop : '6%',
                                width : "100%",
                                borderBottomColor: theme.text_color,
                                borderBottomWidth: 1,
                            }}
                            />
                            <View style = {{ flex : 1 , paddingTop : '10%' , paddingBottom : '10%'}}>
                                {   question.options.map(( option , index ) => {return(
                                    <Option clicked = {this.state.clicked} index = {index} key = {option.option_id} 
                                    outline_color = {theme.outline_color} option = {option} 
                                    question = {question} color_object = {this.state.color_object} 
                                    handleCorrect = {this.handleCorrect} handleInCorrect = {this.handleInCorrect}  />
                                )})}
                            </View>
                        </ScrollView>
                  </GestureRecognizer>
                )}}
            </ThemeContext.Consumer>
        )
    }
}

class Option extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            wrong_dynamic_color : '',
            wrong_dynamic_color_2 : ''
        }
    }
    componentDidMount(){
        this.setState({wrong_dynamic_color : this.props.outline_color })
    }

    render(){
        const { outline_color , option , question , index} = this.props;
        return(
            <Button disabled = {this.props.clicked} bordered large block style = {[{ borderColor : (index === parseInt(question.correct_option_index) - 1 ? (this.props.color_object.correct_dynamic_color === '' ? this.props.outline_color : this.props.color_object.correct_dynamic_color) : this.state.wrong_dynamic_color) ,
                backgroundColor : (index === parseInt(question.correct_option_index) - 1 ? this.props.color_object.correct_dynamic_color_2 : this.state.wrong_dynamic_color_2 )}]} 
                onPress = {() => {if(index === (parseInt(question.correct_option_index) - 1)) {this.props.handleCorrect()} 
            else{this.setState({ wrong_dynamic_color : 'red' , wrong_dynamic_color_2 : 'red'}); this.props.handleInCorrect()}}} >
                <Text uppercase = {false} style = {{ color : outline_color}}> {index + 1 } . {entities.decode(option.option_english_text)}</Text>
            </Button>
        )
    }
}

export default class PracticeSheetComponent extends React.Component {
    constructor(props){
        super(props);
        this.swiper = React.createRef();
        this.state = {
            questions_loading : false,
            questions : [],
            current_index : 1,
            question_count : 0,
            question_array : [],
            modal_visible:  false,
            jump_message : '',
            jump_text : 0,
            current_type : 1,
            types : [] ,
            sub_category_name : '',
            modal_purpose : ''
        }
    }
    
    static navigationOptions = {
        header : null
    }

    handleText = (text) => {
        this.setState({ jump_text : parseInt(text)})
        if(parseInt(text) <= 0 || parseInt(text) > this.state.question_array.length){
            this.setState({ jump_message : 'Invalid Question Number'})
        } else {
            this.setState({ jump_message : ''})
        }
    } 

    handleSwip = async (direction, state) => {
        if(direction === 'SWIPE_LEFT'){
            if(!(this.state.current_index === this.state.question_array.length)){
                await this.setState(state => ({ current_index : state.current_index + 1}))
                let newType = this.state.question_array[this.state.current_index - 1].type
                this.setState({ current_type : newType})
            }
        } else if(direction === 'SWIPE_RIGHT'){
            if(!(this.state.current_index === 1)){
                await this.setState(state => ({ current_index : state.current_index - 1}))
                let newType = this.state.question_array[this.state.current_index - 1].type
                this.setState({ current_type : newType})
            }
        }
    }


    handleJump = (index) => {
        let newType = this.state.question_array[index].type
        this.setState({ modal_visible : false , current_index : index + 1 , current_type : newType })
    }

    close_modal = () => {
        this.setState({ modal_visible : false})
        this.setState({ jump_message : ''})
    }

    makeModalVisible = (purpose) => {
        this.setState({ modal_visible : true , modal_purpose : purpose })
    }

    cancelDialog = () => {
        this.setState({ modal_visible : false})
    }

    updateIndex = (number) => {
      this.setState({ current_index : number })
    }


    makeSwiper = (current_index) => {
        if(this.state.question_array.length === 0){
            return <></>
        } else {
            return <Question handleSwip = {this.handleSwip} index = {current_index - 1} question = {this.state.question_array[current_index - 1]}  />
        }
    }

    jumpType = (type) => {
        let newIndex = 1
        for(let i = 1 ; i <= this.state.types.length ; i++){
            if(parseInt(this.state.types[i-1].type) === type) {
                break
            }else{
                newIndex = newIndex + parseInt(this.state.types[i-1].count)
            }
        }
        this.setState({ current_index : newIndex , modal_visible : false , current_type : type })
    }



    makeTypeRow = () => {
        let component_array = []
        for( let i = 0 ; i < this.state.types.length ; i++){
            component_array.push(
                <ListItem itemDivider key = {i} >
                    <Button style = {{ width : "100%" , justifyContent : 'center' , alignItems : 'center' }}  onPress = {() => this.jumpType(i + 1)} >
                        <Text>{"Type " + (i + 1)}</Text>
                    </Button>   
                </ListItem> 
            )
        }
        return component_array
    }

    makeQuestionSegmentRowWise = () => {
        let no_of_rows = parseInt(this.state.question_array.length / 5) + 1
        let data = Array.from(new Array(no_of_rows),(val,index) => { return {'index' : index}});
        return(
           <FlatList 
            data = {data}
            renderItem = {(i) => (
                <Row key = {`index-${new Date().getUTCMilliseconds() + i.index}`} style = {{ paddingBottom : '5%'}} >
                    {this.makeQuestionRow(i.index)}
                </Row>
            )}
            keyExtractor={i => {return (`index-${new Date().getUTCMilliseconds() + i.index}`)}}
           />
        )
    }

    makeQuestionRow = (i) => {
        let component_array = [] ;
        let start_index = 5 * i ;
        for( let i = start_index ; i < (start_index + 5) ; i++){
           if(i >= this.state.question_array.length)
            {  
                component_array.push(<Col></Col>)
            }else{
                component_array.push(<Custom_Badge current_index = {this.state.current_index} j = {i} key = {i} handleJump = {this.handleJump} />)
           }
        }
        return component_array;
    }

    

    

    componentDidMount() {
        this.setState({ questions_loading : true })
        var navigation = this.props.navigation;
        let sub_category_id = navigation.getParam('sub_category_id')
        let sub_category_name = navigation.getParam('sub_category_name')
        this.setState({ sub_category_name : sub_category_name })
        fetch(baseurl + `questions/fetch_questions_by_sub_category_id/${sub_category_id}/${endurl}`)
        .then((res) => res.json())
        .then((data) => {this.setState({ questions : data.questions , types : data.types })
        
        ///////////////// For Formatiing Data /////////////////////////////
        if(!(data.questions.length === 0)){
        let questions = data.questions
        let question_array = []
        let question = {options : []}
        question_counter = 0
        previous_question_id = null
        for( let i  = 0 ; i <= questions.length ; i++){
            if(i === questions.length){
                question_array.push(question)
                question_counter ++;
                break;
            }
            if(previous_question_id !== questions[i].question_id){
                if( i !== 0){
                    question_array.push(question)
                    question_counter ++;
                }
                question = {options : []}
                previous_question_id = questions[i].question_id
                question.question_id = questions[i].question_id
                question.english_text = questions[i].english_text
                question.hindi_text = questions[i].hindi_text
                question.correct_option_index = questions[i].correct_option_index
                question.type = questions[i].type
                question.pic = questions[i].pic
                question.options.push({ option_id : questions[i].option_id , option_english_text : questions[i].option_english_text , option_hindi_text : questions[i].option_hindi_text })
            } else {
                question.options.push({ option_id : questions[i].option_id , option_english_text : questions[i].option_english_text , option_hindi_text : questions[i].option_hindi_text })
            }
        }
        this.setState({ question_array : question_array , questions_loading : false})
    }else{
        alert("Questions Are Not Uploaded. Please Contact Institute")
        this.setState({ question_array : [] , questions_loading : false})
        this.props.navigation.goBack()
    }
        ///////////////// For Formatiing Data /////////////////////////////
    })
        .catch((err) => { alert("Server Error ....") ; console.log(err)})
    }

    componentDidUpdate(){}
    render() {
        return(
            <ThemeContext.Consumer>
                {( theme ) => {return(
                    <Container style = {{ backgroundColor : theme.background ,   flex:1, flexDirection: 'column' ,justifyContent: 'space-between' }}>
                        <Header style={[styles.androidHeader , { backgroundColor: theme.header_background_color }]}>
                            <Left>
                                <TouchableOpacity onPress = {() => this.props.navigation.goBack()} hitSlop = {{top: 20, bottom: 20, left: 30, right: 30}}> 
                                <Icon name='arrow-back' style = {{ color : 'white' , paddingLeft : "20%"}}  />
                                </TouchableOpacity>
                            </Left>
                            <Body style = {{ flex : 3, justifyContent : 'center' , alignItems : 'center'}} >
                                <Text style = {{ color : 'white' , fontSize : 19 , paddingLeft : '26%'}}>{this.state.questions_loading === true ? `Loading .....` : this.state.sub_category_name}</Text>
                            </Body>
                            <Right>
                                
                            </Right>
                        </Header>
                        <View style = {{ backgroundColor : theme.background  , justifyContent : 'space-between'  , flexDirection : 'row' , paddingTop : '0%'    }}>
                            <Text style = {{ color : theme.text_color , justifyContent : 'flex-start'}}> { ` Q.No  ${this.state.current_index}  /  ${this.state.question_array.length}`} </Text> 
                            <TouchableOpacity onPress = {() => this.makeModalVisible('type')}>
                               <Text style = {{ color : theme.text_color , justifyContent : 'flex-end'}}>{"TYPE  " + this.state.current_type}</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.questions_loading === true ? <Spinner color = {theme.spinner_color} /> : this.makeSwiper(this.state.current_index)}
                        <Dialog
                            width = {1}
                            height = {0.8}
                            visible={this.state.modal_visible}
                            dialogTitle={<DialogTitle title="Switch Question" />}
                            footer={
                                <DialogFooter>
                                <DialogButton
                                    text="CANCEL"
                                    onPress={() => { this.setState({ modal_visible : false}) }}
                                />
                                <DialogButton
                                    text="OK"
                                    onPress={() => { this.setState({ modal_visible : false}) }}
                                />
                                </DialogFooter>
                            }
                            dialogAnimation={new SlideAnimation({
                            slideFrom: 'bottom',
                            })}
                        >
                            <DialogContent style = {{ paddingTop : '4%' , height: "70%"}}>
                                {this.state.modal_purpose === 'type' ? 
                                <ScrollView>
                                   {this.makeTypeRow()}
                                </ScrollView> : 
                                this.makeQuestionSegmentRowWise()}
                            </DialogContent>
                        </Dialog>
                        {this.state.questions_loading === true ? <></> : 
                            <BottomToolBar toolbar_background_color = {theme.header_background_color} question_array = {this.state.question_array} 
                            current_index = {this.state.current_index} 
                            makeModalVisible = {this.makeModalVisible} />
                        }
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
});

