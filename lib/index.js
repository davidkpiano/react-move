'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoveProvider = undefined;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function randomString(length) {
  var result = '';
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }return result;
}
var getY = function getY(elem) {
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

var getX = function getX(elem) {
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

window.onresize = function () {
  Object.keys(window.xys).forEach(function (key) {
    var el = window.xys[key].el;

    window.xys[key].x = getX(el);
    window.xys[key].y = getY(el);
  });
};

function inject(kay, styles) {
  var node = document.getElementById('move-' + kay) || document.createElement('style');
  node.setAttribute('id', 'move-' + kay);
  node.innerHTML = styles;
  document.head.appendChild(node);

  return node;
}

var Move = (function (_React$Component) {
  _inherits(Move, _React$Component);

  function Move() {
    _classCallCheck(this, Move);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Move).call(this));

    _this.state = { style: {} };
    return _this;
  }

  _createClass(Move, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.cloneElement(this.props.children, {
        ref: function ref(el) {
          return _this2._el = _reactDom2.default.findDOMNode(el);
        },
        style: this.state.style
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.componentDidMount();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var kay = this.props.kay;

      var prev = window.xys[kay];

      if (prev && prev.y == getY(this._el)) return;

      if (!prev) {
        window.xys[kay] = {
          x: getX(this._el),
          y: getY(this._el)
        };
      } else {
        var rand = randomString(4);

        inject(kay, '\n@keyframes ' + rand + ' {\n  from {\n    transform:\n      translateX(' + (-getX(this._el) + prev.x) + 'px)\n      translateY(' + (-getY(this._el) + prev.y) + 'px)\n  }\n}\n      ');
        window.xys[kay] = {
          x: getX(this._el),
          y: getY(this._el)
        };
        this.setState({ style: {
            animation: rand + ' 0.3s ease-in-out forwards'
          } });
      }
    }
  }]);

  return Move;
})(_react2.default.Component);

var MoveProvider = exports.MoveProvider = (function (_React$Component2) {
  _inherits(MoveProvider, _React$Component2);

  function MoveProvider(props) {
    _classCallCheck(this, MoveProvider);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(MoveProvider).call(this, props));

    _this3.state = {
      children: props.children
    };
    return _this3;
  }

  _createClass(MoveProvider, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this4 = this;

      setTimeout(function () {
        _this4.setState({
          children: nextProps.children
        });
      }, 2000);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', null, this.state.children);
    }
  }]);

  return MoveProvider;
})(_react2.default.Component);

exports.default = Move;