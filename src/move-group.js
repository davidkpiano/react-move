import React from 'react';
import ReactDOM from 'react-dom';
import difference from 'lodash/difference';
import intersection from 'lodash/intersection';
import filter from 'lodash/filter';

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

  componentWillReceiveProps(nextProps) {
    const { children } = nextProps;

    const nextKeys = React.Children.map(children, (child) => child.key);
    const currentKeys = Object.keys(window.items);

    const keysToEnter = difference(nextKeys, currentKeys);
    const keysToLeave = difference(currentKeys, nextKeys);
    const keysToMove = intersection(currentKeys, nextKeys);

    keysToEnter.forEach(key => window.items[key] = {
      state: 'ENTER',
    });
    keysToLeave.forEach(key => window.items[key].state = 'LEAVE')
    keysToMove.forEach(key => {
      Object.assign(items[key], { state: 'MOVE', pos: items[key].node.getBoundingClientRect() })
    });

    console.group()
      console.log('Entering: ', keysToEnter);
      console.log('Leaving: ', keysToLeave);
      console.log('Moving: ', keysToMove);
      console.log('Items: ', items);
    console.groupEnd();

    this.setState({ children })

  }

  componentDidUpdate() {
    const itemsToMove = filter(items, { state: 'MOVE' });

    itemsToMove.forEach(item => {
      const nextPos = item.node.getBoundingClientRect();
      const prevPos = item.pos;

      console.log(prevPos, nextPos);

      const dx = prevPos.left - nextPos.left;
      const dy = prevPos.top - nextPos.top;

      item.node.animate([
        { transform: `translateX(${dx}px) translateY(${dy}px)` },
        { transform: `translate(0, 0)`}
      ], {
        duration: 1000
      })
    })
  }

  performEnter(key) {
    window.items[key].state = 'ENTER';

    console.log(window.items[key].node.getBoundingClientRect())

    // window.items[key].node.animate(
    //   aliceTumbling,
    //   aliceTiming)
  }

  attachNode(node, key) {
    const item = items[key];

    if (!item) {
      window.items[key] = {
        node: ReactDOM.findDOMNode(node),
      }
    } else {
      window.items[key].node = ReactDOM.findDOMNode(node);
    }
  }

  renderItem(child) {
    return React.cloneElement(
      child,
      {
        ref: (node) => this.attachNode(node, child.key),
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
