var _numberWorker = this;
var generateInterval = 1000;
onmessage = function (e) {
    if (e.data === 'start') {
        setInterval(function () {
            _numberWorker.postMessage(generatePair());
        }, generateInterval);
    }
};
function generatePair() {
    var second = Math.round(Math.random() * 100);
    var value = Math.floor(Math.random() * 90001) + 1000;
    return { second: second, value: value };
}
//# sourceMappingURL=number-generator.js.map