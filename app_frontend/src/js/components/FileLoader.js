import React from 'react';
import { connect } from 'react-redux'
import { processFile } from './../redux';

import Button from '@material-ui/core/Button';

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
      margin: `8px 5px 8px 5px`,
      minWidth: 110,
    },
    label: {
      fontFamily: 'sans-serif',
      zeroMinWidth: 0,
    },
  }
)


class FileLoader extends React.Component {

  loadFile(event) {
    const { dispatch } = this.props
    const file = event.target.files[0];
    if (file) {
    this.setState({fileName: file.name})
    const reader = new FileReader();
    reader.onloadend = (evt) => {
      const dataUrl = evt.target.result;
      dispatch(processFile( { fileName: file.name, fileData: dataUrl } ));
    };
    reader.readAsDataURL(file);
    }
  }


  render() {
    const { classes, fileName } = this.props
    return (
      <div className={classes.fileLoadDiv}>
        <Button size="small" variant="contained" color='secondary'
                component="label" className={classes.buttonFile}>
          {'Choose file'}
          <input hidden type="file"
            accept=".csv, .xls, .xlxs"
            onChange={this.loadFile.bind(this)}
          />
        </Button>
        <div className={classes.label}>
          {fileName && fileName}
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ dataset }) => ({ fileName: dataset.metaData.fileName })
const connectedLoader = connect(mapStateToProps)(withStyles(styles)(FileLoader));
export { connectedLoader as FileLoader }; 