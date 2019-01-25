import React, { Component } from 'react';
import Table from 'react-bootstrap/lib/Table'
import { postData } from './utils.js'
import SweetAlert from 'react-bootstrap-sweetalert'


class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      idToDelete: null,
      alert: null
    };

  this.showConfirmationId = this.showConfirmationId.bind(this)
  this.hideAlert = this.hideAlert.bind(this)
  this.onConfirm = this.onConfirm.bind(this)
  this.deleteDbEntry = this.deleteDbEntry.bind(this)
  }


  componentDidMount(){
    postData('/viewdb', {})
      .then(response => this.setState({data: response.data}))
  }

  deleteDbEntry(id){
    postData('/deletedbentry', {'id': id})
      .then(response => this.setState({data: response.data}))
  }

  showConfirmationId(id){
    this.setState({
      idToDelete: id,
      alert: <SweetAlert
              input
              showCancel
              cancelBtnBsStyle="primary"
              confirmBtnBsStyle="danger"
              title={`Are you sure you want to delete entry ${id}?`}
              placeHolder="Confirm entry id"
              onConfirm={this.onConfirm}
              onCancel={this.hideAlert}
              >
                Confirm entry id:
            </SweetAlert>
    })
  }

  hideAlert(){
    this.setState({alert: null, idToDelete: null})
  }

  onConfirm(value) {
    if (value === this.state.idToDelete){
      this.deleteDbEntry(value)
      this.setState({
      alert: (
        <SweetAlert success title="Record deleted" onConfirm={this.hideAlert}>
          The row associated with id {value} was deleted.
        </SweetAlert>
      )})
    } else {
      this.setState({
      alert: (
        <SweetAlert danger title="Nothing was deleted!" onConfirm={this.hideAlert}>
           ID {value} was given but {this.state.idToDelete} was expected.
        </SweetAlert>
      )})
    } 
  }

  render() {
    const formatRows = data => data.map((d, i) => {
      return <tr align="center" key={`tr-${i}`}>
                <td 
                  id="1"
                  style={{'cursor': 'pointer'}}
                  onDoubleClick={(event)=>this.showConfirmationId(event.target.innerText)}
                >
                { d.id}
                </td>
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
    const rows =  formatRows(this.state.data)
    return (
      <div>
        {this.state.alert}
        <Table striped bordered hover>
          <thead>
            <tr align="center" key="tr-head">
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
      </div>
    )
  }
}

export default DataTable