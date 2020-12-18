

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
        <textarea type="textarea" name="textarea" onChange={this.onChange}/>
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
        <input type="text_field" name="text_field" onChange={this.onChange}/>
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
    const cboxes = this.state.options.map(function(o) {
      return(
        <div className="option">
          <input type="checkbox" id={o.id} onChange={that.onChange} checked={o.checked}/>
          <label for={o.id}>{o.name}</label>
        </div>
      )
    })

    return(
      <div className="question">
        {this.state.name}
        <br />
        {cboxes}
      </div>
    )

  }
}




class Survey extends React.Component {
  constructor(props) {
    super(props)
    this.state = {questions: props.questions}
    this.update = this.update.bind(this)
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
      </div>
    )

  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('/surveys/1').then(res => (res.json()))
  .then(function(res) {
    ReactDOM.render(
      <Survey questions={res} />,
      document.body.appendChild(document.createElement('div')),
    )
  }) 
})
