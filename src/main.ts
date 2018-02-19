

if (window.hasOwnProperty('Worker')) {
  // Create seperate thread for different purposes
  let numberWorker = new Worker('number-generator.js');
  let listManager = new Worker('list-manager.js');
  let oldItemsManager = new Worker('old-items-manager.js');


  //   Start generating numbers
  numberWorker.postMessage('start');

  numberWorker.onmessage = (e: MessageEvent) => {
    listManager.postMessage(['newPair', e.data]);
  };

  listManager.onmessage = function(e: MessageEvent) {
    switch (e.data[0]) {
      case 'latest':
        displayLatest(e.data[1]);
        break;
      case 'oldest':
        oldItemsManager.postMessage(['oldest', e.data[1]]);
        break;
    }
  };


  oldItemsManager.onmessage = (e: MessageEvent) => {
    switch (e.data[0]) {
      case 'median':
        break;
    }
  };


  // Register display sum button
  let sumButton = document.getElementById('sumButton') as HTMLElement;
  sumButton.addEventListener('click', () => {
    listManager.postMessage(['oldest']);
  });


} else {
  alert('Please run this page using Chrome/Firefox');
}

function displayLatest(items: Array<ListItem>) {
  console.log(items);
  let table = document.getElementById('latest') as HTMLTableElement;
  table.innerHTML = '';
  table.insertRow(0).insertCell(0).innerHTML = '<b>Latest</b>';
  items.forEach((item, index) => {

    let row = table.insertRow(index + 1);
    let cell = row.insertCell(0);
    cell.innerText = item.pair.value.toString();
  });
}


function displayOldestItems(items: ListItem[]) {
  let tbody = document.getElementById('oldestBody');
  console.log(tbody);
}
