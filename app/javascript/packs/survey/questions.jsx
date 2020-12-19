import React from 'react'

class Textarea extends React.Component {
  constructor(props) {
    super(props)
    this.state = props
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    this.props.update({...this.state, textarea: e.target.value})
    this.setState({['textarea']: e.target.value})
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

class TextField extends React.Component {
  constructor(props) {
    super(props)
    this.state = props
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    this.props.update({...this.state, text_field: e.target.value})
    this.setState({['text_field']: e.target.value})
  }

  render() {
    return(
      <div className="question">
        <label>
          {this.state.name}
        </label>
        <br />
        <input type="text_field" name="text_field" value={this.state.text_field} onChange={this.onChange}/>
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
    this.setState(state)
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

export {Textarea, TextField, Checkbox} 