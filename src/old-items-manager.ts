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
  // Save for calculating median
  sums.unshift(sum);
  _oldItemsManager.postMessage(['sum', sum]);
}
