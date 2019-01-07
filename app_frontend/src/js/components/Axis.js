import React from 'react';
import { axisLeft as d3axisLeft,
         axisBottom as d3axisBottom } from 'd3-axis'
import { select as d3select } from 'd3-selection'
import { format } from 'd3-format'


class Axis extends React.Component {
  constructor(props) {
    super(props);
    this.myAxis = React.createRef();
    this.orientation = this.props.orientation;
    this.drawAxis = this.drawAxis.bind(this)
  }

  drawAxis(){
    const axis = this.orientation === "left" 
      ? d3axisLeft(this.props.scale).tickFormat(format(",.3f")) 
      : d3axisBottom(this.props.scale)

    d3select(this.myAxis.current)
      .call(axis)
  }

  componentDidUpdate() {
    this.drawAxis()
  }

  componentDidMount() {
    this.drawAxis()
  }

  render() {

    const rotate = this.orientation === "left"
      ? " rotate(-90)"
      : ""
    
    return <g transform={`translate(${this.props.left}, ${this.props.top})`}>
              <g ref={this.myAxis}></g>
              {this.props.label && this.props.label.showLabel &&
               <text transform={`translate(${this.props.label.left}, ${this.props.label.top})${rotate}`} style={{textAnchor: "middle"}}>
                 {this.props.label.text}
               </text>
              }
           </g>
  }
}

export default Axis