import React, { Component } from 'react';
import Table from 'react-bootstrap/lib/Table'
import { postData } from './utils.js'

const formatRows = data => data.map(d => {
  return <tr align="center">
            <td>{d.id}</td>
            <td>{d.name}</td>
            <td>{d.trace}</td>
            <td>{d.fit_d1.toFixed(3)}</td>
            <td>{d.fit_a1.toFixed(5)}</td>
            <td>{d.fit_d2.toFixed(3)}</td>
            <td>{d.fit_a2.toFixed(5)}</td>
            <td>{d.fit_c.toFixed(3)}</td>
            <td>{d.fit_amp.toFixed(3)}</td>
            <td>{d.ref_amp.toFixed(3)}</td>
          </tr>
})

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount(){
    postData('/viewdb', {})
      .then(response => this.setState({data: response.data}))
  }

  render() {
    const rows =  formatRows(this.state.data)
    return (
      <Table striped bordered hover>
        <thead>
          <tr align="center">
            <td>ID</td>
            <td>Experiment</td>
            <td>Trace #</td>
            <td>Decay 1</td>
            <td>Amplitude 1</td>
            <td>Decay 2</td>
            <td>Amplitude 2</td>
            <td>Constant</td>
            <td>FitAmp</td>
            <td>RefAmp</td>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    )
  }
}

export default DataTable