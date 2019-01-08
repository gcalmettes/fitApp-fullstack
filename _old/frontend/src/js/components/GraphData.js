import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { max, extent } from 'd3-array';
import Axis from './Axis.js'

const isInRange = (i, range) => i >= range[0] && i <= range[1]

const GraphData = (props) => {
  let { data, dataFit, margins, xRange, fitBounds, refBounds, onSelect} = props

  margins = margins 
    ? margins
    : {left: 55, top: 20, right: 20, bottom: 45} 

  const width = 600,
        height = 350,
        innerWidth = width - margins.left - margins.right,
        innerHeight = height - margins.top - margins.bottom

  const xScaleRange = (xRange && xRange[1]!==xRange[0]) ? xRange : [0, max(data.length ? data : [{x: 1}], d => d.x)]

  const xScale = scaleLinear()
    .domain(xScaleRange)
    .range([0, innerWidth])
  const yScale = scaleLinear()
    .domain(data.length ? extent(data, d => d.y).map((d,i) => i ? d+0.004 : d-0.004) : [0, 1])
    .range([innerHeight, 0])

  const lineGenerator = line()
    .curve(curveMonotoneX)
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  const dots = data.map((d, i) => {
    return <circle 
      cx={xScale(d.x)}
      cy={yScale(d.y)}
      r={3}
      key={`dot-${i}`}
      fill={
        isInRange(i, fitBounds) 
          ? '#FF8B22' // orange
          : isInRange(i, refBounds)
            ? 'yellow' // blue
            : 'lightblue'} 
      stroke={'black'}
      onClick={() => onSelect(i)}
     />
  })

  const pathData = lineGenerator(data)
  const pathDataFit = dataFit
    ? lineGenerator(dataFit)
    : ""
  
  return <div>
      <svg width={width} height={height}>
        <defs>
          <clipPath id="clipMask">
            <rect x={0} y={-margins.top} width={innerWidth} height={margins.top+innerHeight}></rect>
          </clipPath>
        </defs>
        <g width={innerWidth} height={innerHeight} transform={`translate(${margins.left}, ${margins.top})`}>
          <Axis 
            left = {0}
            top = {innerHeight}
            label = {{ left: innerWidth/2 , 
                       top: 35, 
                       text: "Time (sec)",
                       showLabel: true
                     }}
            scale = {xScale}
            orientation = "bottom"
          />
          <Axis 
            left = {0}
            top = {0}
            label = {{ left: -40 , 
                       top: innerHeight/2 , 
                       text: "YFP/CFP",
                       showLabel: true
                     }}
            scale = {yScale}
            orientation = "left"
          />
          <g className='clipped'>
            <path d={pathData} style={{'fill': 'none', 'stroke': 'black'}}/>
            {dots}
            <path d={pathDataFit} style={{'fill': 'none', 'stroke': 'purple', 'strokeWidth': 3}}/>
          </g>
        </g>
      </svg>
    </div>
}

export default GraphData