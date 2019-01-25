import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';

class ButtonFile extends React.Component {
  constructor(props) {
    super(props);

    this.updateData = this.props.updateData
    this.loadFile = this.loadFile.bind(this)
  }

  loadFile(event) {
    const file = event.target.files[0];
    if (file) {
    const reader = new FileReader();
    reader.onloadend = (evt) => {
      const dataUrl = evt.target.result;
      this.updateData(file.name, dataUrl)
    };
    reader.readAsDataURL(file);
    }
  }

  // render() {
  //   return <input 
  //     type="file" 
  //     accept=".csv, .xls, .xlxs" 
  //     id="myFile" 
  //     multiple size="50" 
  //     onChange={this.loadFile}
  //   />
  // }
  render() {
    return <FormControl
      style={{'width': '550px'}} 
      type="file" 
      accept=".csv, .xls, .xlxs" 
      onChange={this.loadFile}
    />
  }
}

export default ButtonFile
