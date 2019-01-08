import React from 'react';
import { connect } from 'react-redux'
// import { setDataFocusRange } from './../redux';
import { dataActions } from './../redux'

import {brushX as d3brushX} from 'd3-brush';
import {select as d3select,
        event as d3event} from 'd3-selection';


class Brush extends React.Component {
  
  constructor(props) {
    super(props);
    this.myBrush = React.createRef();
    this.brush = d3brushX()
      .extent([[0, 0], [this.props.width, this.props.height]])
      .handleSize(20)
      .on("start brush", this.brushing.bind(this))
      .on("end brush", this.brushing.bind(this))
  }

  componentDidMount() {
    d3select(this.myBrush.current)
      .call(this.brush)
  }

  componentDidUpdate() {
    const { focusRange, hasData, dispatch } = this.props
    const brushExtent = this.myBrush.current.__brush.selection
    const isCorrectExtent = focusRange && brushExtent && [brushExtent[0][0], brushExtent[1][0]]
      .reduce((curr, val, i) => curr && (focusRange[i] === this.props.scale.invert(val)), true)
    if (!hasData || !isCorrectExtent) {
      // clear brush
      d3select(this.myBrush.current)
        .call(this.brush.move, null);
    }
  }

  brushing(){
    const { hasData } = this.props
    if (hasData && d3event && d3event.selection) {
      const focusRange = d3event.selection.map(d => this.props.scale.invert(d))
      const { dispatch } = this.props
      if (focusRange[0] != focusRange[1]) {
        dispatch({
          type: dataActions.SET_FOCUS_RANGE, 
          dataset: { focusRange }
        })
      } else if (focusRange) {
        dispatch({
          type: dataActions.SET_FOCUS_RANGE, 
          dataset: { focusRange: null }
        })
      }    
    }
  }

  render() {
    return <g ref={this.myBrush}></g>
  }
}

const mapStateToProps = ({ dataset }) => ({ focusRange: dataset.dataset.focusRange, hasData: dataset.dataset.size })
const connectedBrush = connect(mapStateToProps)(Brush);
export { connectedBrush as Brush }; 