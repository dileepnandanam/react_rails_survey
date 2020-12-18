

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'


class Textarea extends React.Component {
  constructor(props) {
    super(props)
    this.state = props
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    this.props.update({...this.state, textarea: e.target.value})
  }

  render() {
    return(
      <div className="question">
        <label>
          {this.state.name}
        </label>
        <br />
        <textarea type="textarea" name="textarea" value={this.state.textarea} onChange={this.onChange}/>
        {this.state.errors}
      </div>
    )
  }
}

class TextField extends Textarea {

  onChange(e) {
    this.props.update({...this.state, text_field: e.target.value})
  }

  render() {
    return(
      <div className="question">
        <label>
          {this.state.name}
        </label>
        <br />
        <input type="text_field" name="text_field" value={this.state.textarea} onChange={this.onChange}/>
        {this.state.errors}
      </div>
    )
  }
}



class Checkbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = props
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    var position = -1
    this.state.options.forEach(function(o, i) {
      if(e.target.id == o.id)
        position = i
    })

    var state = this.state
    state.options[position].checked = e.target.checked
    this.props.update(this.state)
  }

  render() {
    const that = this
    const cboxes = this.state.options.map(function(o, i) {
      return(
        <div className="option" key={i}>
          <input type="checkbox" id={o.id} onChange={that.onChange} checked={o.checked}/>
          <label htmlFor={o.id}>{o.name}</label>
        </div>
      )
    })

    return(
      <div className="question">
        {this.state.name}
        <br />
        {cboxes}
        {this.state.errors}
      </div>
    )

  }
}




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
    this.setState(state)
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
        return(<Checkbox {...q} update={that.update} key={q.key}/>)
      else if(q.answertype == 'textarea')
        return(<Textarea {...q} update={that.update} key={q.key}/>)
      else if(q.answertype == 'text_field')
        return(<TextField {...q} update={that.update} key={q.key}/>)
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
