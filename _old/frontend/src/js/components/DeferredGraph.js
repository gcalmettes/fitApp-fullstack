import React, { Component } from 'react';
import { json } from 'd3-fetch'

const getData = async (num) => 
  num 
    ? await json(`/data/${num}`) 
    : await json('/data')

const drawRect = data => {
  return data.map((d,i) => 
    <rect 
      x = {i*20}
      y = {10}
      width = {10}
      height = {10}
      fill = {d.color}
      key = {`rect-${i}`}
    />
  )
}

class DeferredGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      num: this.props.num
    };
  }

  componentWillMount() {
    getData(this.state.num).then(data => {
      this.setState({ data });
    });
  }

  componentDidUpdate() {
    (this.props.num !== this.state.num)
      &&  getData(this.props.num).then(data => {
            this.setState({ data: data, num: this.props.num });
          })
  }

  render() {
      return <div>
        <svg height={50} width={500}>
          {drawRect(this.state.data)}
        </svg>
      </div>
  }
}

export default DeferredGraph