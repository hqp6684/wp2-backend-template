

export function removeRedundantData(input: number): number {

    let inputString = input.toString().split('');
    let uniqueRecords: string[] = []
    let repeatedValues: string[] = [];
    let mark = '!'

    inputString.forEach((element, _index) => {
        if (uniqueRecords.indexOf(element) == -1) {
            uniqueRecords.push(element);
        } else {
            repeatedValues.push(element);
        }
    });
    inputString.forEach((element, index) => {
        repeatedValues.indexOf(element) > -1 ?
            inputString[index] = mark :
            inputString[index] = element;
    })
    let output = inputString.join('').split(mark).join('');
    return Number(output);
}


