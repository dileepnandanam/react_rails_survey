

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {Textarea, TextField, Checkbox} from './survey/questions.jsx'

class Survey extends React.Component {
  constructor(props) {
    super(props)
    this.state = {questions: props.questions}
    this.update = this.update.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  update(data) {
    var position = -1
    this.state.questions.forEach(function(q, i) {
      if(data.id == q.id)
        position = i
    })
    var state = this.state
    state.questions[position] = data
  }

  onClick(e) {
    e.preventDefault()
    var data = {response: {answers_attributes: {

    }}}

    this.state.questions.forEach(function(q, i) {
      if(q.answertype == 'checkbox') {
        data.response.answers_attributes[i] = {
          question_id: q.id,
          choices_attributes: q.options.filter(option => (option.checked == true)).map(function(option) {
            return({option_id: option.id})
          })
        } 
      }
      else if(q.answertype == 'textarea') {
        data.response.answers_attributes[i] = {
          question_id: q.id,
          textarea: q.textarea
        }
      }
      else if(q.answertype == 'text_field') {
        data.response.answers_attributes[i] = {
          question_id: q.id,
          text_field: q.text_field
        }
      }
    })
    
    const that = this
    fetch('/responses', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => (res.json()))
    .then(function(res) {
      if(res.res == 'ok') {
        alert('success')
      }
      else {
        that.setState({questions: res})
      }
    })

  }

  render() {
    const that = this
    const questions = this.state.questions.map(function(q, i) {
      if(q.answertype == 'checkbox')
        return(<Checkbox {...q} update={that.update}/>)
      else if(q.answertype == 'textarea')
        return(<Textarea {...q} update={that.update}/>)
      else if(q.answertype == 'text_field')
        return(<TextField {...q} update={that.update}/>)
    })

    return(
      <div className="survey">
        <h1>Give Details</h1>
        {questions}
        <button type="submit" onClick={this.onClick} >Submit</button>
      </div>
    )

  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('/responses/new').then(res => (res.json()))
  .then(function(res) {
    ReactDOM.render(
      <Survey questions={res} />,
      document.body.appendChild(document.createElement('div')),
    )
  }) 
})
