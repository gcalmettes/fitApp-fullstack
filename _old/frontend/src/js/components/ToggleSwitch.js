import React from 'react';



class ToggleSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    }
  this.handleChange = this.handleChange.bind(this)

  }

  handleChange(event){
    this.props.onChange(event.target.checked)
    this.setState({checked: event.target.checked})
  }

  render() {

    const text = this.state.checked 
      ? this.props.texts[1]
      : this.props.texts[0]

    const color = this.state.checked 
      ? '#fb4c52'
      : '#B4B4B4'
    
    return (
      <div style={this.props.style}>
        <label className="toggle" style={{'marginTop': '10px'}}>
          <input 
            type="checkbox"
            onChange={this.handleChange}/>
          <span className="slider round"></span>
          <span 
            className="toggleName"
            style = {{
              'position': 'absolute',
              'top': '3px',
              'left': '70px',
              'right': 0,
              'bottom': 0,
              'fontFamily': 'sans-serif',
              'fontSize': '1.3em',
              'color': color
            }}
          >
            {text}
          </span>
        </label>
      </div>
    )
  }
}

export default ToggleSwitch