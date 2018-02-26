
interface NumberPair {
  second: number;
  value: number;
}

interface ListItem {
  inUse: boolean;
  pair: NumberPair;
  //   onTimeUp: (index: number) => void;
  //   Use to mark item that wasn't deleted due to in use status
  timeUp: boolean;
  index?: number;
}

const _listWorker: Worker = this;
//
const LLength = 10000;
const L = new Array<ListItem>();
const toBeRemovedL = new Array<ListItem>();
// 5 seconds
const lUpdateInterval = 5000;
let LPointer = -1;
let lIsFull = false;


onmessage = function(e: MessageEvent) {
  switch (e.data[0]) {
    case 'newPair':
      let pair: NumberPair = e.data[1];
      addNumberPairToL(pair);
      break;
    case 'oldest':
      updateOldest10();
      break;
  }
};



/**
 * Update L every 5 seconds.
 */
function updateL() {
  setInterval(() => {
    updateLatest20();
  }, lUpdateInterval);
}

/**
 * Helper to updateL() function
 */
function updateLatest20() {
  // clean up toBeRemovedL
  toBeRemovedL.forEach(ri => {
    if (ri) {
      let lIndex = L.indexOf(ri);
      console.log('remove pair from list');
      removeItemFromL(lIndex);
    }
  });
  toBeRemovedL.splice(0);
  // Since addNewPair pushes new item to the end of the array
  // 20 latest items are from the left of the pointer
  // i = 1 because pointer is pointing at the to-be-replaced (the next latest)
  let result: Array<ListItem> = [];

  let loop = true;
  let undefinedCount = 0;
  let i = 1;
  while (loop) {
    let index = ((LPointer - i) + LLength) % LLength;
    let item = L[index];
    if (item) {
      if (!item.timeUp) {
        result.push(item);
        item.inUse = true;
      } else {
        item.inUse = false;
      }
    } else {
      undefinedCount++;
    }
    i++;
    // Conditions to break the loop
    if (undefinedCount > 3 || result.length === 20) {
      loop = false;
    }
  }
  _listWorker.postMessage(['latest', result]);
}



function updateOldest10() {
  let result: Array<ListItem> = [];

  let loop = true;
  let undefinedCount = 0;
  let i = 0;
  console.log('Looking for the 10 oldest items');
  while (loop) {
    if (lIsFull) {
      // if L has been filled one, oldest items are from the the
      // right of LPointer
      let index = ((LPointer + i) + LLength) % LLength;
      let item = L[index];
      if (item) {
        if (!item.timeUp) {
          result.push(item);
        }
      } else {
        undefinedCount++;
      }
      // L is not filled yet
    } else {
      let index = i;
      let item = L[index];
      if (item) {
        if (!item.timeUp) {
          result.push(item);
        }
        i++;
      } else {
        undefinedCount++;
      }
    }
    if (result.length === 10 || undefinedCount > 3) {
      console.log(result.length);
      console.log(undefinedCount);
      loop = false;
    }
  }

  _listWorker.postMessage(['oldest', result]);
  undefinedCount = 0;
}
/**
 * Triggered after received a new pair
 * @param pair from number-generator worker
 */
function addNumberPairToL(pair: NumberPair) {
  console.log('Adding new pair', pair);

  //   convert 1-100 to seconds
  pair.second = pair.second * 1000;
  // First case after initialization
  if (LPointer === -1) {
    let newItem: ListItem = {inUse: false, pair: pair, timeUp: false};
    // pointer = 0
    LPointer++;
    //   Replace old item with new item
    insertNewItem(LPointer, newItem);
    //   update pointer
    LPointer++;
    // Start updating L
    console.log('Trigger auto update');
    updateL();
    return;
  }

  let loop = true;
  while (loop) {
    let toBeRemovedItem = L[LPointer];

    if (toBeRemovedItem === undefined && LPointer < LLength - 1) {
      let newItem: ListItem = {inUse: false, pair: pair, timeUp: false};
      //   Replace old item with new item

      insertNewItem(LPointer, newItem);
      //   update pointer
      LPointer++;
      //   Break the loop
      loop = false;
    } else if (toBeRemovedItem !== undefined && LLength < LLength - 1) {
      if (toBeRemovedItem.inUse) {
        toBeRemovedL.indexOf(toBeRemovedItem) > -1 ?
            toBeRemovedL.push(toBeRemovedItem) :
            console.log('item not found');
        LPointer++;
      } else {
        let newItem: ListItem = {inUse: false, pair: pair, timeUp: false};
        //   Replace old item with new item
        insertNewItem(LPointer, newItem);
        // break loop
        loop = false;
      }
    }

    if (LPointer === LLength - 1) {
      // Case where pointer is at the end of L
      // L has been filled one
      lIsFull = true;

      if (toBeRemovedItem.inUse) {
        toBeRemovedL.indexOf(toBeRemovedItem) > -1 ?
            toBeRemovedL.push(toBeRemovedItem) :
            console.log('item not found');
      } else {
        let newItem: ListItem = {inUse: false, pair: pair, timeUp: false};
        //   Replace old item with new item

        insertNewItem(LPointer, newItem);
        // break loop
        loop = false;
      }
      // reset pointer
      LPointer = 0;
    }
  }

  /**
   * Helper to addNumberPairToL
   * @param index
   * @param item
   */
  function insertNewItem(index: number, item: ListItem) {
    L[index] = item;
    // set auto delete
    setTimeout(() => {
      //   The index from args may have changed due to L constantly gets
      //   updated
      let currentIndex = L.indexOf(item);
      // If not in use
      if (!L[currentIndex].inUse) {
        console.log('Time out removal');
        removeItemFromL(currentIndex);
      } else {
        // mark to be deleted later
        L[currentIndex].timeUp = true;
        toBeRemovedL.indexOf(L[currentIndex]) > -1 ?
            toBeRemovedL.push(L[currentIndex]) :
            // tslint:disable-next-line:no-unused-expression
            false;
      }
    }, item.pair.second);
  }
}

/**
 *
 * Helper function
 * @param index current index of the item
 */
function removeItemFromL(index: number) {
  console.log('Removing pair at index ', index);
  L.splice(index, 1);
  //  removing item on the right side of the LPointer does not affect the
  //  current value of LPOinter
  index > LPointer ? LPointer = LPointer : LPointer--;
  console.log('lPointer', LPointer);
}
