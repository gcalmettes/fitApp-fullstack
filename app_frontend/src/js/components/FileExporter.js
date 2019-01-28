import React from 'react';
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { postData } from '../helpers'

import { withStyles } from '@material-ui/core/styles';
import { theme, addToTheme } from './theme';


const styles = addToTheme(
  {
    fileLoadDiv: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      margin: 0,
      background: 'lightgray'
    },
    buttonFile: {
      margin: `10px 8px 10px 5px`,
      minWidth: 110,
    },
  }
)


const getKeys = (obj, prefix = '') => {
  if (typeof obj === 'undefined' || obj === null) return [];
  return [
    ...Object.keys(obj).map(key => `${prefix}${key}`),
    ...Object.entries(obj).reduce((acc, [key, value]) => {
      if (typeof value === 'object') return [...acc, ...getKeys(value, `${prefix}${key}.`)];
      return acc;
    }, []),
  ];
}

const flatObject = (obj, prefix = '') => {
  if (typeof obj === 'undefined' || obj === null) return {};
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'object') return { ...acc, ...flatObject(value, `${prefix}${key}.`) };
    return { ...acc, [`${prefix}${key}`]: value };
  }, {});
}

const escapeCsvValue = (cell) => {
  if (cell.replace(/ /g, '').match(/[\s,"]/)) {
    return '"' + cell.replace(/"/g, '""') + '"';
  }
  return cell;
}

const objectsToCsv = (arrayOfObjects) => {
  // collect all available keys
  const keys = new Set(arrayOfObjects.reduce((acc, item) => [...acc, ...getKeys(item)], []));
  // for each object create all keys
  const values = arrayOfObjects.map(item => {
    const fo = flatObject(item);
    const val = Array.from(keys).map((key) => (key in fo ? escapeCsvValue(`${fo[key]}`) : ''));
    return val.join(',');
  });
  return `${Array.from(keys).join(',')}\n${values.join('\n')}`;
}

const downloadCSV = (args) => {  
  let data, filename, link;
  let csv = objectsToCsv(args.data);
  if (csv == null) return;

  filename = args.filename || 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}


class FileExporter extends React.Component {

  downloadData(){
    const { authentication: { access_token }, dispatch } = this.props
    postData('/data/export', {}, access_token)
      .then(response => downloadCSV({data: JSON.parse(response.data)}))
  }

  render() {
    const { classes, fileName } = this.props
    return (
      <div className={classes.fileLoadDiv}>
        <Button size="small" variant="contained" color='secondary'
                component="label" className={classes.buttonFile}
                onClick={this.downloadData.bind(this)}>
          {'Export'}
        </Button>
        <Typography>
          Export data to csv
        </Typography>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({ 
  authentication,
})
const connectedExporter = connect(mapStateToProps)(withStyles(styles)(FileExporter));
export { connectedExporter as FileExporter }