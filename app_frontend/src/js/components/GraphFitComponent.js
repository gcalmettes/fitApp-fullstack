import React, { Component } from 'react';

import { scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { extent } from 'd3-array';
import Axis from './Axis.js'

import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';

const styles = addToTheme(
  {
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 3,
      paddingBottom: theme.spacing.unit * 1,
    },
  }
)

const FitComponent = (props) => {
  let { params, paramValues, data, margins, classes } = props

  margins = margins 
    ? margins
    : {left: 50, top: 20, right: 10, bottom: 50} 

  const width = 250,
        height = 250,
        innerWidth = width - margins.left - margins.right,
        innerHeight = height - margins.top - margins.bottom

  const xScale = scaleLinear()
    .domain(extent(data, d => d.x))
    .range([0, innerWidth])
  
  const yScale = scaleLinear()
    .domain(extent(data, d => d.y))
    .range([innerHeight, 0])

  const lineGenerator = line()
    .curve(curveMonotoneX)
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  return (
    <Paper className={classes.root} elevation={1}>
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
          {params.map((p, i) => {
            let paramName = p.split('_')
            paramName = paramName[paramName.length-1]
            return <text key={p} x={innerWidth} y={10+i*15} textAnchor={'end'}>
                {`${paramName}: ${paramValues[p].toFixed(3)}`}
              </text>
          })
          }
          <path d={lineGenerator(data)} style={{'fill': 'none', 'stroke': 'black'}}/>
        </g>
      </svg>
    </Paper>
  )
}

export const GraphFitComponent = withStyles(styles)(FitComponent)