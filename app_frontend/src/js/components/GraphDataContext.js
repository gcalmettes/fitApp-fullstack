import React, { Component } from 'react';
import { connect } from 'react-redux'
import { dataActions } from './../redux/actionTypes';

import { scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { max, extent } from 'd3-array';
import Brush from './Brush.js'

import { isEmpty } from './../helpers'

const GraphDataContext = (props) => {
  let { dataset, margins, focusRange, onBrush} = props
  const data = !isEmpty(dataset.dataset.data) 
    ? dataset.dataset.data[`trace${dataset.dataset.currentTrace-1}`] 
    : []

  margins = margins 
    ? margins
    : {left: 20, top: 10, right: 20, bottom: 10} 

  const width = 600,
        height = 60,
        innerWidth = width - margins.left - margins.right,
        innerHeight = height - margins.top - margins.bottom

  const xScale = scaleLinear()
    .domain([0, max(data, d => d.x) | 0])
    .range([0, innerWidth])
  const yScale = scaleLinear()
    .domain(extent(data, d => d.y))
    .range([innerHeight, 0])

  const lineGenerator = line()
    .curve(curveMonotoneX)
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  const dots = data.map((d, i) => {
    return <circle 
      cx={xScale(d.x)}
      cy={yScale(d.y)}
      r={1}
      key={`dot-${i}`}
      fill={'lightblue'}
      stroke={'black'}
     />
  })

  const path = lineGenerator(data)
  
  return <div>
    <svg width={width} height={height}>
      <g width={innerWidth} height={innerHeight} transform={`translate(${margins.left}, ${margins.top})`}>
        <path d={path} style={{'fill': 'none', 'stroke': 'black'}}/>
        {dots}
        <Brush 
          width={innerWidth}
          height={innerHeight}
          dataLimits = {focusRange ? focusRange : xScale.domain()}
          scale = {xScale}
          onBrush = {onBrush}
        />
      </g>
    </svg>
  </div>
}

const mapStateToProps = ({ dataset }) => ({ dataset })
const connectedContext = connect(mapStateToProps)(GraphDataContext);
export { connectedContext as GraphDataContext }; 