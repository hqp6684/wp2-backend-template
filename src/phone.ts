

let numbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
export function generatePhoneNumber(_length: number, _excludedNumber: string[]) {

    _excludedNumber.forEach(element => {
        numbers.indexOf(element) > -1 ?
            numbers.splice(numbers.indexOf(element), 1) :
            numbers = numbers;
    })
    console.log(numbers);
    let bank = util(numbers, 5)
    bank.forEach(element => {
        console.log(element);
    })

}

generatePhoneNumber(5, ['3', '1']);

function util(input: string[], _length: number) {
    let temp: string = '';
    let bank: string[] = [];
    for (let j = 1; j < numbers.length; j++) {
        for (let i = 0; i < numbers.length - 1; i++) {
            temp = input[i];
            input[i] = input[i + 1];
            input[i + 1] = temp;
            bank.push(input.join(''));
        }
    }
    return bank;
}

