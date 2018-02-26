var _oldItemsManager = this;
var sums = [];
onmessage = function (e) {
    switch (e.data[0]) {
        case 'oldest':
            calculateSum(e.data[1]);
            break;
        case 'median':
            postMedian();
    }
};
var reducer = function (accumulator, currentValue) {
    return accumulator.pair.value + currentValue.pair.value;
};
function calculateSum(items) {
    var sum = items.filter(function (item) { return item !== undefined; })
        .map(function (i) { return i.pair.value; })
        .reduce(function (a, b) { return a + b; });
    postSum(sum);
}
function postSum(sum) {
    sums.unshift(sum);
    _oldItemsManager.postMessage(['sum', sum]);
}
function postMedian() {
    console.log('getting median');
    var median = 0;
    switch (sums.length) {
        case 0:
            median = 0;
            break;
        case 1:
            median = sums[0];
            break;
        default:
            var mod = sums.length % 2;
            var index = 0;
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
//# sourceMappingURL=old-items-manager.js.map