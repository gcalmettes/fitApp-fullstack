import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { extent } from 'd3-array';
import Axis from './Axis.js'

const GraphDataComponent = (props) => {
  let { data, margins } = props
  let params

  params = data && data['params']
  data = data && data['data']

  margins = margins 
    ? margins
    : {left: 50, top: 20, right: 10, bottom: 50} 

  const width = 300,
        height = 250,
        innerWidth = width - margins.left - margins.right,
        innerHeight = height - margins.top - margins.bottom

  const xScale = scaleLinear()
    .domain(data ? extent(data, d => d.x) : [0, 1])
    .range([0, innerWidth])
  const yScale = scaleLinear()
    .domain(data ? extent(data, d => d.y) : [0, 1])
    .range([innerHeight, 0])

  const lineGenerator = line()
    .curve(curveMonotoneX)
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));


  const pathData = data 
    ? lineGenerator(data)
    : ''

  return <div>
      <svg width={width} height={height}>
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
            label = {{ left: -35 , 
                       top: innerHeight/2 , 
                       text: "YFP/CFP",
                       showLabel: true
                     }}
            scale = {yScale}
            orientation = "left"
          />
          {params &&
            <text x={innerWidth} y={10} textAnchor={'end'}>{`Decay: ${params['decay'].toFixed(3)}`}</text>
          }
          {params &&
            <text x={innerWidth} y={30} textAnchor={'end'}>{`Amplitude: ${params['amplitude'].toFixed(3)}`}</text>
          }
          <path d={pathData} style={{'fill': 'none', 'stroke': 'black'}}/>
        </g>
      </svg>
    </div>
}

export default GraphDataComponent