if (window.hasOwnProperty('Worker')) {
    var numberWorker = new Worker('number-generator.js');
    var listManager_1 = new Worker('list-manager.js');
    var oldItemsManager_1 = new Worker('old-items-manager.js');
    numberWorker.postMessage('start');
    numberWorker.onmessage = function (e) {
        listManager_1.postMessage(['newPair', e.data]);
    };
    listManager_1.onmessage = function (e) {
        switch (e.data[0]) {
            case 'latest':
                displayLatest(e.data[1]);
                break;
            case 'oldest':
                oldItemsManager_1.postMessage(['oldest', e.data[1]]);
                break;
        }
    };
    oldItemsManager_1.onmessage = function (e) {
        switch (e.data[0]) {
            case 'median':
                displayMedian(e.data[1]);
                break;
            case 'sum':
                displaySum(e.data[1]);
                break;
        }
    };
    var sumButton = document.getElementById('sumButton');
    sumButton.addEventListener('click', function () {
        listManager_1.postMessage(['oldest']);
    });
    var medianButton = document.getElementById('medianButton');
    medianButton.addEventListener('click', function () {
        oldItemsManager_1.postMessage(['median']);
    });
}
else {
    alert('Please run this page using Chrome/Firefox');
}
function displayLatest(items) {
    var table = document.getElementById('latest');
    table.innerHTML = '';
    table.insertRow(0).insertCell(0).innerHTML = '<b>Latest</b>';
    items.forEach(function (item, index) {
        var row = table.insertRow(index + 1);
        var cell = row.insertCell(0);
        cell.innerText = item.pair.value.toString();
    });
}
function displaySum(sum) {
    var tbody = document.getElementById('sum');
    var row = tbody.insertRow(0);
    var cell = row.insertCell();
    cell.innerHTML = sum.toString();
}
function displayMedian(median) {
    var tbody = document.getElementById('median');
    tbody.innerHTML = '';
    var row = tbody.insertRow(0);
    var cell = row.insertCell();
    cell.innerHTML = median.toString();
}
//# sourceMappingURL=main.js.map