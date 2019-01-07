import React from 'react';

class SVGcontainer extends React.PureComponent {
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <svg width={this.props.width} height={this.props.height}>
          <g transform = {`translate(${this.props.margins.left}, ${this.props.margins.top})`}
             width = {this.props.width - this.props.margins.left - this.props.margins.right}
             height = {this.props.height - this.props.margins.left - this.props.margins.top}
          >
            {this.props.children}
          </g>
        </svg>
      </div>
    );
  }
}

export default SVGcontainer