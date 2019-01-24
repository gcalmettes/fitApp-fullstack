import React from 'react';
import { connect } from 'react-redux'

import { postData } from '../helpers'
import { VirtualizedTable } from './VirtualizedTable'
import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';


class DataTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      idToDelete: null,
      alert: null
    };

    // this.showConfirmationId = this.showConfirmationId.bind(this)
    // this.hideAlert = this.hideAlert.bind(this)
    // this.onConfirm = this.onConfirm.bind(this)
    // this.deleteDbEntry = this.deleteDbEntry.bind(this)
  }

  componentDidMount(){
    const { authentication: { access_token }, dispatch } = this.props
    postData('/data/view', {}, access_token)
      .then(response => this.setState({data: response.data}))
  }
  
  render(){
    console.log(this.state.data.map(d => d))

    const rows = this.state.data
      .map(d => {
        const params = (
          <div>
            {Object.entries(JSON.parse(d.fitParams))
              .map(([key, value]) => {
                const innerText = `${key}: ${value.toFixed(4)}`
                return key !== 'c' ? <div>{innerText}</div> : null
              })
            }
          </div>
        )
        console.log(params)
        return {
          ...d,
          fitParams: params
        }
        // fitParams: JSON.parse(d.fitParams)
      })
    return (
      <Paper style={{ height: 600, width: '100%' }}>
        <VirtualizedTable
          rowCount={rows.length}
          rowGetter={({ index }) => rows[index]}
          // onRowClick={event => console.log(event)}
          onRowDoubleClick={event => console.log(event)}
          columns={[
            {
              width: 50,
              label: 'ID',
              dataKey: 'id',
            },
            {
              width: 200,
              flexGrow: 1.0,
              label: 'File name',
              dataKey: 'fileName',
            },
            {
              width: 50,
              label: 'Trace',
              dataKey: 'traceNumber',
              numeric: true,
            },
            {
              width: 150,
              flexGrow: 0.4,
              label: 'Parameters',
              dataKey: 'fitParams',
            },
            {
              width: 170,
              label: 'Method',
              dataKey: 'fitMethod',
            },
            {
              width: 150,
              label: 'Comment',
              dataKey: 'comment',
            },
          ]}
        />
      </Paper>
    )
  }
}

const mapStateToProps = ({ authentication }) => ({ 
  authentication,
})
const connectedDataTable = connect(mapStateToProps)(DataTable);
export { connectedDataTable as DataTable }; 