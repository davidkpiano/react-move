import difference from 'lodash/difference';
import intersection from 'lodash/intersection';

window.difference = difference
window.intersection = intersection

export function updateAll(currentKeys, nextKeys) {
  return (dispatch, getState) => {  
    const keysToEnter = difference(nextKeys, currentKeys);
    const keysToLeave = difference(currentKeys, nextKeys);
    const keysToMove = intersection(currentKeys, nextKeys);

    console.group()
      console.log('Entering: ', keysToEnter);
      console.log('Leaving: ', keysToLeave);
      console.log('Moving: ', keysToMove);
      console.log('Items: ', items);
    console.groupEnd();

    const entering = keysToEnter.map((key) => ({
      key,
      state: 'ENTER'
    }));

    const leaving = keysToLeave.map((key) => ({
      key,
      state: 'LEAVE'
    }));

    const moving = keysToMove.map((key) => {
      console.log(key, getState()[key])
      return {      
        key,
        state: 'MOVE',
        pos: getState()[key].node.getBoundingClientRect()
      }
    });

    dispatch({
      type: 'UPDATE_ALL',
      data: [].concat(entering, leaving, moving),
    });
  }
}

export function update(key, data) {

    return ({
      type: 'UPDATE',
      key,
      data,
    });

    // if (!item) {
    //   dispatch({
    //     type: 'ENTER',
    //     key,
    //     data,
    //   });
    // } else {    
    //   dispatch({
    //     type: 'UPDATE',
    //     key,
    //     data,
    //   });
    // }
}
