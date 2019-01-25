import React from 'react';

import {brushX as d3brushX} from 'd3-brush';
import {select as d3select,
        event as d3event} from 'd3-selection';

const brushed = (scale, callback) => {
  if (d3event && d3event.selection) {
    const range = d3event.selection.map(d => scale.invert(d))
    callback(range) 
  }
}

class Brush extends React.Component {
  
  constructor(props) {
    super(props);
    this.myBrush = React.createRef();
    this.brush = d3brushX()
      .extent([[0, 0], [this.props.width, this.props.height]])
      .handleSize(20)
      .on("start brush", () => brushed(this.props.scale, this.props.onBrush))
      .on("end brush", () => brushed(this.props.scale, this.props.onBrush))
  }

  componentDidMount() {
    d3select(this.myBrush.current)
      .call(this.brush)
  }

  componentDidUpdate() {
    const dataLims = this.props.dataLimits//.map(d => this.props.scale.invert(d))
    const brushExtent = this.myBrush.current.__brush.selection
    const isCorrectExtent = brushExtent && [brushExtent[0][0], brushExtent[1][0]]
      .reduce((curr, val, i) => curr && (dataLims[i] === this.props.scale.invert(val)), true)
    if (!isCorrectExtent) {
      // clear brush
      d3select(this.myBrush.current)
        .call(this.brush.move, null);
    }
  }

  render() {
    return <g ref={this.myBrush}></g>
  }
}

export default Brush
