import React from 'react';
import ReactDOM from 'react-dom';
import 'web-animations-js/web-animations-next-lite.min.js';

import MoveGroup from './move-group';

function randomString(length) {
    var result = '';
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
const getY = ( elem ) => {
  var location = 0;
  if (elem.offsetParent) {
    do {
      location += elem.offsetTop;
      location -= elem.scrollTop;
      elem = elem.offsetParent;
    } while (elem);
  }
  return location >= 0 ? location : 0;
};

const getX = ( elem ) => {
  var location = 0;
  if (elem.offsetParent) {
    do {
      location += elem.offsetLeft;
      elem = elem.offsetParent;
    } while (elem);
  }
  return location >= 0 ? location : 0;
};

window.xys = {};

window.onresize = () => {
  Object.keys(window.xys).forEach(key => {
    let el = window.xys[key].el;

    window.xys[key].x = getX(el);
    window.xys[key].y = getY(el);
  });
}

function inject(kay, styles) {
  const node = document.getElementById(`move-${kay}`)
    || document.createElement('style');
  node.setAttribute('id', `move-${kay}`);
  node.innerHTML = styles;
  document.head.appendChild(node);

  return node
}
class _Move extends React.Component {
  constructor() {
    super();
    this.state = { style: {} }
  }
  render() {
    return React.cloneElement(
      this.props.children,
      {
        ref: (el) => this._el = ReactDOM.findDOMNode(el),
        style: this.state.style
      }
    );
  }
  componentDidUpdate() {
    this.componentDidMount()
  }
  componentDidMount() {
    let { kay } = this.props;

    let prev = window.xys[kay];

    if (prev && prev.y == getY(this._el)) return;

    if (!prev) {
      window.xys[kay] = {
        x: getX(this._el),
        y: getY(this._el)
      };
    } else {
      let rand = randomString(4);

      inject(kay, `
@keyframes ${rand} {
  from {
    transform:
      translateX(${-getX(this._el) + prev.x}px)
      translateY(${-getY(this._el) + prev.y}px)
  }
}
      `);
      window.xys[kay] = {
        x: getX(this._el),
        y: getY(this._el)
      };
      this.setState({style: {
        animation: `${rand} 0.3s ease-in-out forwards`
      }})
    }
  }
}

export class MoveProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      children: props.children
    };
  }

  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      this.setState({
        children: nextProps.children
      })
    }, 2000);
  }

  render() {
    return React.createElement(
      'div',
      null,
      this.state.children);
  }
}

export default Move;

class Move extends React.Component {

  render() {
    const { val } = this.props;

    return <div className="item" onClick={this.props.onClick} key={val}>Item {val}</div>
  }
}

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      items: [1,2,3,4,5]
    }
  }
  render() {
    return (
      <MoveGroup>
      {
        this.state.items.map(i =>
          <Move val={i} onClick={() => this.setState({items: [2,3,4,5,6]})} key={i} />
        )
      }
      </MoveGroup>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
