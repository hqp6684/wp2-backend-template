const _oldItemsManager = this;


interface NumberPair {
  second: number;
  value: number;
}

const sums: number[] = [];

onmessage = function(e: MessageEvent) {
  switch (e.data[0]) {
    case 'oldest':
      //   displayOldestItems(e.data[1], e.data[2]);
      calculateSum(e.data[1]);
      break;
    case 'median':
      postMedian();
  }

};


const reducer = (accumulator: ListItem, currentValue: ListItem) =>
    accumulator.pair.value + currentValue.pair.value;

function calculateSum(items: ListItem[]) {
  let sum = items.filter(item => item !== undefined)
                .map(i => i.pair.value)
                .reduce((a, b) => a + b);
  postSum(sum);
}

function postSum(sum: number) {
  // Save result for calculating median later
  sums.unshift(sum);
  _oldItemsManager.postMessage(['sum', sum]);
}

function postMedian() {
  console.log('getting median');
  let median = 0;
  switch (sums.length) {
    case 0:
      median = 0;
      break;
    case 1:
      median = sums[0];
      break;
    default:
      let mod = sums.length % 2;
      let index = 0;
      // nested switch
      switch (mod) {
        case 0:
          index = Math.floor(sums.length / 2);
          median = Math.round((sums[index] + sums[index - 1]) / 2);
          break;
        case 1:
          index = Math.floor(sums.length / 2);
          median = sums[index];
      }
  }
  _oldItemsManager.postMessage(['median', median]);
}
