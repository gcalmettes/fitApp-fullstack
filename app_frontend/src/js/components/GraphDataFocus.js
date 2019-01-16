import React, { Component } from 'react';
import { connect } from 'react-redux'
import { dataActions } from './../redux/actionTypes';

import { scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { max, extent } from 'd3-array';
import Axis from './Axis.js'

import { isEmpty } from './../helpers'

const isInRange = (i, range) => i >= range[0] && i <= range[1]

const updateFitRange = (idx, currentFitRange, dispatch, clear) => {
  let fitRange
  if (clear) {
    dispatch({
      type: dataActions.SET_FIT_RANGE, 
      analysis: { fitRange: null }
    })
  } else {
    if (currentFitRange) {
      const [currentMin, currentMax] = currentFitRange
      if (currentMin === 0 && currentMax !== 0) {
          fitRange = idx > currentMax 
            ? [currentMax, idx]
            : [idx, currentMax]
        } else if (idx <= currentMin) {
          fitRange = [idx, currentMax]
        } else if (idx >= currentMax) {
          fitRange = [currentMin, idx]
        } else {
          const diffMin = idx-currentMin,
                diffMax = currentMax-idx
          fitRange = diffMin <= diffMax 
            ? [idx, currentMax]
            : [currentMin, idx]
        }
    } else {
      fitRange = [0, idx]
    }
    dispatch({
      type: dataActions.SET_FIT_RANGE, 
      analysis: { fitRange }
    })
  }
}


const GraphDataFocus = (props) => {
  let { traces, currentTrace, fitRange, focusRange, fitLineData, margins, dispatch} = props

  const data = !isEmpty(traces) 
    ? traces[`trace${currentTrace-1}`] 
    : []

  margins = margins 
    ? margins
    : {left: 55, top: 20, right: 20, bottom: 45} 

  const width = 600,
        height = 350,
        innerWidth = width - margins.left - margins.right,
        innerHeight = height - margins.top - margins.bottom

  const xScaleRange = (focusRange && focusRange[1]!==focusRange[0]) 
    ? focusRange 
    : [0, max(data.length ? data : [{x: 1}], d => d.x)]

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
        fitRange && isInRange(i, fitRange) 
          ? '#FF8B22' // orange
          : 'lightblue'} 
      stroke={'black'}
      onClick={(e) => updateFitRange(i, fitRange, dispatch, e.type=='contextmenu')}
      onContextMenu={(e) => updateFitRange(i, fitRange, dispatch, e.type=='contextmenu')}
     />
  })

  const pathData = lineGenerator(data)
  const pathDataFit = fitLineData
    ? lineGenerator(fitLineData)
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


const mapStateToProps = ({ dataset }) => ({ 
  traces: dataset.metaData.data,
  currentTrace: dataset.display.currentTrace,
  focusRange: dataset.display.focusRange,
  fitRange: dataset.analysis.fitRange
})
const connectedFocus = connect(mapStateToProps)(GraphDataFocus);
export { connectedFocus as GraphDataFocus };