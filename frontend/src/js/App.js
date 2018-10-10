import React from 'react';
import { BrowserRouter, Route, Switch, Link} from 'react-router-dom'

import Title from './components/Title.js'
import GridLayout from './components/GridLayout.js'
import ButtonFile from './components/ButtonFileLoader.js'
import GraphData from './components/GraphData.js'
import GraphDataContext from './components/GraphDataContext.js'
import GraphDataComponent from './components/GraphDataComponent.js'
import { postData } from './components/utils.js'
import Button from 'react-bootstrap/lib/Button';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';

import { ColoredLine, Divider} from './components/ColoredHr.js'
import ToggleSwitch from './components/ToggleSwitch.js'

import DataTable from './components/DataTable.js'


import 'bootstrap/dist/css/bootstrap.min.css';

const defaultParams = {
  dataFocusRange: null,
  dataRangeToFit: [
    {name: 'start', x: 0}, 
    {name: 'end', x: 0}
  ],
  dataFit: {
    data: null,
    components: {
      component1: null, //expo1
      component2: null, //expo2
      component3: null  //constant
    }
  },
  dataRangeForRef: [
    {name: 'start', x: 0}, 
    {name: 'end', x: 0}
  ]
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({
      fileName:'',
      data: [],
      nTrace: null,
      currentTrace: null,
    }, defaultParams);

    this.updateData = this.updateData.bind(this)
    this.clearFit = this.clearFit.bind(this)
    this.onBrushDataContext = this.onBrushDataContext.bind(this)
    this.onSelectBounds = this.onSelectBounds.bind(this)
    this.sendRangeToFit = this.sendRangeToFit.bind(this)
    this.saveData = this.saveData.bind(this)
    this.showNext = this.showNext.bind(this)
    this.showPrevious = this.showPrevious.bind(this)
    this.AnalysisPanel = this.AnalysisPanel.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
  }

  updateData(filename, filedata) {
    postData('/readdata', {'data': filedata})
      .then(response => this.setState({
        fileName: filename,
        data: response.data,
        nTrace: response.size,
        currentTrace: 0
      }))
  }

  resetScene(){

  }

  showNext(){
    const next = this.state.currentTrace < this.state.nTrace - 1
      ? this.state.currentTrace + 1
      : this.state.currentTrace
    
    this.setState(
      Object.assign(
        {currentTrace: next}, 
        defaultParams
      )
    )     
  }

  showPrevious(){
    const previous = this.state.currentTrace > 0
      ? this.state.currentTrace - 1
      : this.state.currentTrace
    this.setState(
      Object.assign(
        {currentTrace: previous}, 
        defaultParams
      )
    )       
  }

  clearFit(){
    this.setState(defaultParams)
  }

  saveData(){
    // don't send any data to server if no data have been selected
    (this.state.dataFit.components.component1)
      && postData('/savedata', {
        'data': [
          this.state.fileName, 
          this.state.currentTrace, 
          this.state.dataFit.components.component1.params.decay, 
          this.state.dataFit.components.component1.params.amplitude,
          this.state.dataFit.components.component2.params.decay, 
          this.state.dataFit.components.component2.params.amplitude,
          this.state.dataFit.components.component3.params.c,
          this.state.dataRangeToFit[0].x,
          this.state.dataRangeToFit[1].x,
          this.state.data[`trace${this.state.currentTrace}`][this.state.dataRangeToFit[0].x].y,
          this.state.data[`trace${this.state.currentTrace}`][this.state.dataRangeToFit[1].x].y,
          this.state.dataRangeForRef[0].x,
          this.state.dataRangeForRef[1].x,
          this.state.data[`trace${this.state.currentTrace}`][this.state.dataRangeForRef[0].x].y,
          this.state.data[`trace${this.state.currentTrace}`][this.state.dataRangeForRef[1].x].y
        ]
      }).then(response => console.log(response))
  }

  onBrushDataContext(focusRange){
    this.setState({dataFocusRange: focusRange})
  }

  onSelectBounds(bound){
    if (!this.state.switchToRef) {
      // bound selection for fitting
      const [currentMin, currentMax] = this.state.dataRangeToFit.map(d => d.x)
      let newRange

      if (currentMin === 0 && currentMax !== 0) {
        newRange = [currentMax, bound]
      } else if (bound <= currentMin) {
        newRange = [bound, currentMax]
      } else if (bound >= currentMax) {
        newRange = [currentMin, bound]
      } else {
        const diffMin = bound-currentMin,
              diffMax = currentMax-bound
        newRange = diffMin <= diffMax 
          ? [bound, currentMax]
          : [currentMin, bound]
      }
      this.setState({
        dataRangeToFit: [
          {name: 'start', x: newRange[0]}, 
          {name: 'end', x: newRange[1]}
        ]
      })
    } else {
      // bound selection for reference
      const [currentMin, currentMax] = this.state.dataRangeForRef.map(d => d.x)
      let newRange

      if (currentMin === 0 && currentMax !== 0) {
        newRange = [currentMax, bound]
      } else if (bound <= currentMin) {
        newRange = [bound, currentMax]
      } else if (bound >= currentMax) {
        newRange = [currentMin, bound]
      } else {
        const diffMin = bound-currentMin,
              diffMax = currentMax-bound
        newRange = diffMin <= diffMax 
          ? [bound, currentMax]
          : [currentMin, bound]
      }
      this.setState({
        dataRangeForRef: [
          {name: 'start', x: newRange[0]}, 
          {name: 'end', x: newRange[1]}
        ]
      })
    }
  }

  sendRangeToFit() {
    // don't send any data to server if no data have been selected
    this.state.dataRangeToFit.reduce((acc, val) => val !== 0 || acc, false)
      && postData('/sendtofit', {
        'data': this.state.data[`trace${this.state.currentTrace}`],
        'fitRange': this.state.dataRangeToFit.map(d => d.x)})
          .then(data => this.setState({
              dataFit: {
                data: data['model']['data'],
                components: {
                  component1: data['expo1'], //expo1
                  component2: data['expo2'], //expo2
                  component3: data['constant']  //constant
                }
              }
            })
          )
  }

  handleSwitch(status){
    this.setState({switchToRef: status})
  }

  AnalysisPanel(){
    return <GridLayout>
          <GridLayout.NavTop>
            <ButtonFile updateData={this.updateData}/>
            <Button 
              variant="dark" 
              onClick={this.showPrevious}
              style={{'marginLeft': '100px'}}
            >
              Previous
            </Button>
            <Button 
              variant="dark"
              onClick={this.showNext}
              style={{'marginLeft': '2px'}}
            >
              Next
            </Button>
          </GridLayout.NavTop>
          <GridLayout.NavLeft>
            <Divider title='Selection'/>
            <ToggleSwitch 
              texts = {['Fit', 'Ref']}
              onChange={this.handleSwitch}
              style={{'marginLeft': '10px', 'marginBottom': '11px'}}
            />
            <Divider title='Fit'/>
            <Button 
              variant="light" 
              onClick={() => this.sendRangeToFit()}
              style={{'marginBottom': '10px', 'marginTop': '10px'}}
            >
              Fit Model
            </Button>
            <Button 
              variant="light"
              onClick={() => this.clearFit()}
              style={{'marginBottom': '30px'}}
            >
              Clear fit
            </Button>
            <Divider title='Save'/>
            <Button 
              variant="light" 
              onClick={() => this.saveData()}
              style={{'marginTop': '10px', 'marginBottom': '10px'}}
            >
              Save data
            </Button>
          </GridLayout.NavLeft>
          <GridLayout.Main>
            <GraphData 
              data={this.state.data[`trace${this.state.currentTrace}`] || []} 
              dataFit={this.state.dataFit.data}
              xRange={this.state.dataFocusRange}
              fitBounds={this.state.dataRangeToFit.map(d => d.x)}
              refBounds={this.state.dataRangeForRef.map(d => d.x)}
              onSelect={this.onSelectBounds}
            />
          </GridLayout.Main>
          <GridLayout.SubMain>
            <GraphDataContext 
              data={this.state.data[`trace${this.state.currentTrace}`] || []} 
              focusRange={this.state.dataFocusRange}
              onBrush={this.onBrushDataContext} />
          </GridLayout.SubMain>
          <GridLayout.BlockRight1>
            <GraphDataComponent 
              data = {this.state.dataFit.components.component1}
            />
          </GridLayout.BlockRight1>
          <GridLayout.BlockRight2>
            <GraphDataComponent 
              data = {this.state.dataFit.components.component2}
            />
          </GridLayout.BlockRight2>
        </GridLayout>
  }

  render () {
    return (
      <BrowserRouter>
        <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">FitApp</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/" href="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/data" href="/">Data</Nav.Link>
            </Nav>
          </Navbar>
          <Switch>
            <Route exact path='/' component={this.AnalysisPanel} />
            <Route path='/data' component={DataTable} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}