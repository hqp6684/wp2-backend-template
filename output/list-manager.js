var _listWorker = this;
var LLength = 10000;
var L = new Array();
var toBeRemovedL = new Array();
var lUpdateInterval = 5000;
var LPointer = -1;
var lIsFull = false;
onmessage = function (e) {
    switch (e.data[0]) {
        case 'newPair':
            var pair = e.data[1];
            addNumberPairToL(pair);
            break;
        case 'oldest':
            updateOldest10();
            break;
    }
};
function updateL() {
    setInterval(function () {
        updateLatest20();
    }, lUpdateInterval);
}
function updateLatest20() {
    toBeRemovedL.forEach(function (ri) {
        if (ri) {
            var lIndex = L.indexOf(ri);
            console.log('remove pair from list');
            removeItemFromL(lIndex);
        }
    });
    toBeRemovedL.splice(0);
    var result = [];
    var loop = true;
    var undefinedCount = 0;
    var i = 1;
    while (loop) {
        var index = ((LPointer - i) + LLength) % LLength;
        var item = L[index];
        if (item) {
            if (!item.timeUp) {
                result.push(item);
                item.inUse = true;
            }
            else {
                item.inUse = false;
            }
        }
        else {
            undefinedCount++;
        }
        i++;
        if (undefinedCount > 3 || result.length === 20) {
            loop = false;
        }
    }
    _listWorker.postMessage(['latest', result]);
}
function updateOldest10() {
    var result = [];
    var loop = true;
    var undefinedCount = 0;
    var i = 0;
    console.log('Looking for the 10 oldest items');
    while (loop) {
        if (lIsFull) {
            var index = ((LPointer + i) + LLength) % LLength;
            var item = L[index];
            if (item) {
                if (!item.timeUp) {
                    result.push(item);
                }
            }
            else {
                undefinedCount++;
            }
        }
        else {
            var index = i;
            var item = L[index];
            if (item) {
                if (!item.timeUp) {
                    result.push(item);
                }
                i++;
            }
            else {
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
function addNumberPairToL(pair) {
    console.log('Adding new pair', pair);
    pair.second = pair.second * 1000;
    if (LPointer === -1) {
        var newItem = { inUse: false, pair: pair, timeUp: false };
        LPointer++;
        insertNewItem(LPointer, newItem);
        LPointer++;
        console.log('Trigger auto update');
        updateL();
        return;
    }
    var loop = true;
    while (loop) {
        var toBeRemovedItem = L[LPointer];
        if (toBeRemovedItem === undefined && LPointer < LLength - 1) {
            var newItem = { inUse: false, pair: pair, timeUp: false };
            insertNewItem(LPointer, newItem);
            LPointer++;
            loop = false;
        }
        else if (toBeRemovedItem !== undefined && LLength < LLength - 1) {
            if (toBeRemovedItem.inUse) {
                toBeRemovedL.indexOf(toBeRemovedItem) > -1 ?
                    toBeRemovedL.push(toBeRemovedItem) :
                    console.log('item not found');
                LPointer++;
            }
            else {
                var newItem = { inUse: false, pair: pair, timeUp: false };
                insertNewItem(LPointer, newItem);
                loop = false;
            }
        }
        if (LPointer === LLength - 1) {
            lIsFull = true;
            if (toBeRemovedItem.inUse) {
                toBeRemovedL.indexOf(toBeRemovedItem) > -1 ?
                    toBeRemovedL.push(toBeRemovedItem) :
                    console.log('item not found');
            }
            else {
                var newItem = { inUse: false, pair: pair, timeUp: false };
                insertNewItem(LPointer, newItem);
                loop = false;
            }
            LPointer = 0;
        }
    }
    function insertNewItem(index, item) {
        L[index] = item;
        setTimeout(function () {
            var currentIndex = L.indexOf(item);
            if (!L[currentIndex].inUse) {
                console.log('Time out removal');
                removeItemFromL(currentIndex);
            }
            else {
                L[currentIndex].timeUp = true;
                toBeRemovedL.indexOf(L[currentIndex]) > -1 ?
                    toBeRemovedL.push(L[currentIndex]) :
                    false;
            }
        }, item.pair.second);
    }
}
function removeItemFromL(index) {
    console.log('Removing pair at index ', index);
    L.splice(index, 1);
    index > LPointer ? LPointer = LPointer : LPointer--;
    console.log('lPointer', LPointer);
}
//# sourceMappingURL=list-manager.js.map