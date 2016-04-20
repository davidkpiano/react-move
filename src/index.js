import React from 'react';
import ReactDOM from 'react-dom';
import 'web-animations-js/web-animations-next-lite.min.js';

import MoveGroup from './move-group';

export default Move;

import { update } from './move-actions';

class Move extends React.Component {
  constructor(){
    super()

    this.state = {cls: ''}
  }
  render() {
    const { val, effect, timing, moveKey } = this.props;

    const items = moveStore.getState();

    // moveStore.dispatch(update(moveKey, {
    //   enter: { effect, timing }
    // }));

    return <div className={`item ${this.state.cls}`} onClick={this.props.onClick} key={val} onMouseOver={()=>this.setState({cls:'over'})}>Item {val}</div>
  }
  componentDidUpdate() {
    const { onRender } = this.props;

    onRender();
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
      <div>
        <MoveGroup key="a">
        {
          this.state.items.map(i =>
            <Move val={i} onClick={() => this.setState({items: this.state.items.map(i=>i+1)})} moveKey={i}
              key={i}
              effect={[
                {transform: 'translateY(100%)', opacity: 0},
                {transform: 'translateY(0)', opacity: 1}
              ]} timing={{duration: 1000, fill: 'both', easing: 'ease-in-out' }}/>
          )
        }
        </MoveGroup>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
