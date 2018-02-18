interface NumberPair {
  second: number;
  value: number;
}

const _numberWorker: Worker = this;
// 1 second
const generateInterval = 1000;
onmessage = function(e: MessageEvent) {
  if (e.data === 'start') {
    setInterval(() => {
      _numberWorker.postMessage(generatePair());
    }, generateInterval);
  }
};


function generatePair(): NumberPair {
  // 1 - 100 seconds
  let second = Math.round(Math.random() * 100);
  // 1000 - 100000
  let value = Math.floor(Math.random() * 90001) + 1000;
  return {second: second, value: value};
}
