import React from 'react';
import ReactDOM from 'react-dom';
import difference from 'lodash/difference';
import intersection from 'lodash/intersection';
import filter from 'lodash/filter';
import map from 'lodash/map';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import { update, updateAll } from './move-actions';

window.items = {};

const initialState = {};

const reducer = (state = initialState, action) => {
  console.log(action);

  switch (action.type) {
    case 'UPDATE':
      if (!action.key) {
        console.log('wtf', action);
      }
      const key = action.key + '';

      return {
        ...state,
        [key]: {
          key,
          ...state[key],
          ...action.data,
        }
      }

    case 'UPDATE_ALL':
      return action.data.reduce((prev, next) => {
        return reducer(prev, update(next.key, next));
      }, state);

    default:
      return state;
  }
};

window.moveStore = applyMiddleware(thunk)(createStore)(reducer);

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
        child && this.performEnter(child.props.moveKey);
      }
    });
  }

  componentWillUpdate() {
    console.log('updatein');
  }

  componentWillReceiveProps(nextProps) {
    const { children } = nextProps;

    const nextKeys = React.Children.map(children, (child) => child.props.moveKey+'');
    const currentKeys = Object.keys(moveStore.getState());

    const keysToEnter = difference(nextKeys, currentKeys);
    const keysToLeave = difference(currentKeys, nextKeys);
    const keysToMove = intersection(currentKeys, nextKeys);

    // keysToEnter.forEach(key => window.items[key] = {
    //   key: key,
    //   state: 'ENTER'
    // });
    // keysToLeave.forEach(key => window.items[key].state = 'LEAVE')
    // keysToMove.forEach(key => {
    //   Object.assign(items[key], { state: 'MOVE', pos: items[key].node.getBoundingClientRect() })
    // });

    moveStore.dispatch(updateAll(currentKeys, nextKeys));

    this.setState({ children })
  }

  componentDidUpdate() {
    const itemsToMove = filter(moveStore.getState(), { state: 'MOVE' });

    this.performMove(items);

    const itemsToEnter = filter(moveStore.getState(), { state: 'ENTER' });
    itemsToEnter.forEach(item => {
      item.node.animate(
        item.enter.effect,
        item.enter.timing);
    });
  }

  performEnter(key) {
    moveStore.dispatch(update(key, {
      state: 'ENTER',
      pos: moveStore.getState()[key].node.getBoundingClientRect()
    }));
  }

  performMove(items) {
    items.forEach(item => {
      const { node, key } = item;
      console.log(`moving ${key}`)

      const nextPos = node.getBoundingClientRect();

      const prevPos = item.pos;

      console.log(item.key, prevPos);

      const dx = prevPos.left - nextPos.left;
      const dy = prevPos.top - nextPos.top;

      if (!(dx + dy)) return;

      const animation = node.animate([
        { transform: `translateX(${dx}px) translateY(${dy}px)` },
        { transform: `translateX(0) translateY(0)`}
      ], {
        duration: 1000,
        easing: 'ease-in-out'
      });

      animation.onfinish = () => moveStore.dispatch(update(key, {
        pos: node.getBoundingClientRect()
      }));
    });
  }

  attachNode(node, props) {
    const key = props.moveKey;

    moveStore.dispatch(update(key, {
      with: 'node',
      node: ReactDOM.findDOMNode(node),
      enter: {
        effect: props.effect,
        timing: props.timing,
      }
    }));
  }

  handleRender(key) {
    const items = moveStore.getState();
    console.log('item', items[key]);
    const node = items[key].node;
    const prevPos = items[key].pos;
    const nextPos = node.getBoundingClientRect();

    console.log(key, prevPos);

    const dx = prevPos.left - nextPos.left;
    const dy = prevPos.top - nextPos.top;

    if (!(dx + dy)) {
      console.log('nah nothing change');
    } else {
      console.log('ooh now')
      this.performMove(filter(items, ()=>true))
    }
  }

  renderItem(child) {
    return React.cloneElement(
      child,
      {
        ref: (node) => this.attachNode(node, child.props),
        onRender: () => {
          console.log(child.props.moveKey, child);
          this.handleRender(child.props.moveKey)
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
