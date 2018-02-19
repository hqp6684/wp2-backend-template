const _oldItemsManager = this;


interface NumberPair {
  second: number;
  value: number;
}

const oldData: NumberPair[] = [];

onmessage = function(e: MessageEvent) {
  switch (e.data[0]) {
    case 'oldest':
      //   displayOldestItems(e.data[1], e.data[2]);
      break;
  }

};


const reducer = (accumulator: ListItem, currentValue: ListItem) =>
    accumulator.pair.value + currentValue.pair.value;

function calculateSum(items: ListItem[]) {
  let sum = items.filter(item => item !== undefined)
                .map(i => i.pair.value)
                .reduce((a, b) => a + b);
  return sum;
}
