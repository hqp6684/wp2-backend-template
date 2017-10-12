

const eligibleLetters = ['A', 'a', 'E', 'e', 'I', 'i', 'o', 'O', 'u', 'U'];

function gibber(input: string) {
    input = '^';
    return input



}

interface VowelRecord {
    char: string;
    index: number;
}

export function transformString(input: string) {

    let array = input.split('');

    let maxTranformNumber = 4;

    let offset = 3;


    let records: VowelRecord[] = [];

    array.map((value, index) => {
        if (eligibleLetters.indexOf(value) > -1) {
            records.push({ char: value, index: index })
        }
    })

    records = records.slice(offset, offset + maxTranformNumber);

    records.map((value) => {
        array[value.index] = gibber(value.char);
    });
    return array.join('');

}