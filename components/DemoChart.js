import React from 'react'
import { PieChart } from 'react-native-svg-charts'
 
export default class DemoChart extends React.PureComponent {
 
    render() {
        
        let array = this.props.test_question_array
        let pieDataArray = []
        let incorrect = array.filter((item) => {
            return (parseInt(item.attempted_index) !== 0 && parseInt(item.attempted_index) !== parseInt(item.correct_option_index))
        })
        let correct = array.filter((item) => {
            return (parseInt(item.attempted_index) !== 0 && parseInt(item.attempted_index) === parseInt(item.correct_option_index))
        })
        let unattempt = array.filter((item) => {
            return (parseInt(item.attempted_index) === 0)
        })
        let total = incorrect.length + correct.length + unattempt.length
        pieDataArray.push({
            value : incorrect.length,
            svg: {
                fill: 'red',
                onPress: () => alert(`${incorrect.length} Out Of ${total} Questions Are Wrong`),
            },
            arc: { padAngle: 0 },
            key: `pie-0`,
        })
        pieDataArray.push({
            value : correct.length,
            svg: {
                fill: 'green',
                onPress: () => alert(`${correct.length} Out Of ${total} Questions Are Correct`),
            },
            arc: { padAngle: 0 },
            key: `pie-1`,
        })
        pieDataArray.push({
            value : unattempt.length,
            svg: {
                fill: 'yellow',
                onPress: () => alert(`${unattempt.length} Out Of ${total} Questions Are Not Attempted`)
            },
            arc: { padAngle: 0 },
            key: `pie-2`,
        })
        return (
            <PieChart
                style={ { height: "70%"  , paddingTop : '10%' } }
                data={ pieDataArray } 
                spacing={0}
            />
        )
    }
 
}



