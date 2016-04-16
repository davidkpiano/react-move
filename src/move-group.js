import React from 'react';
import ReactDOM from 'react-dom';
var aliceTumbling = [
  { transform: 'rotate(0) translate3D(-50%, -50%, 0', color: '#000' }, 
  { color: '#431236', offset: 0.333},
  { transform: 'rotate(360deg) translate3D(-50%, -50%, 0)', color: '#000' }
];

var aliceTiming = {
  duration: 3000,
  iterations: Infinity
}
window.items = {};

export default class MoveGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      children: props.children,
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { children } = this.props;

    React.Children.forEach(children, (child) => {
      if (child && child.type.name === 'Move') {
        child && this.performEnter(child.key);
      }
    });
  }

  performEnter(key) {
    window.items[key].state = 'ENTER-START';

    window.items[key].node.animate(
      aliceTumbling,
      aliceTiming)
  }

  renderItem(child) {
    return React.cloneElement(
      child,
      {
        ref: (node) => window.items[child.key] = {
          node: ReactDOM.findDOMNode(node),
        },
        ...child.props,
      });
  }

  render() {
    return React.createElement(
      'div',
      {},
      React.Children.map(
        this.state.children,
        this.renderItem.bind(this)));
  }
}
