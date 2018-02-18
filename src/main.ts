

if (window.hasOwnProperty('Worker')) {
  let numberWorker = new Worker('number-generator.js');
  let listManager = new Worker('list-manager.js');

  //   Start generating numbers
  numberWorker.postMessage('start');

  numberWorker.onmessage = (e: MessageEvent) => {
    listManager.postMessage(['newPair', e.data])
  };

  listManager.onmessage = function(e: MessageEvent) {
    switch (e.data[0]) {
      case 'latest':
        displayLatest(e.data[1]);
        break;
      case 'oldest':

        break;
    }
  };


} else {
  alert('Please run this page using Chrome/Firefox')
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
  })
}