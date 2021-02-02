
import fs from 'fs';
import readline from 'readline';
import { ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE } from './constants.js'


export const reduceOutputToGroupedLines = (readFileOutputAsArrayOfLines, writeToGroupedNumberSequenceSpecificLines) => {
  readFileOutputAsArrayOfLines.reduce((accumulator, currentValue, currentIndex, sourceArray) => {
    const {length} = accumulator;

    if (!Array.isArray(accumulator[length-1]) || accumulator[length-1].length === 3) {
      accumulator[length] = [];
    }

    if (currentValue.length > 0) {
      (accumulator[length] || accumulator[length-1]).push(currentValue);
    }

    return accumulator
  }, writeToGroupedNumberSequenceSpecificLines)
};

export const identifyNumber = (firstLine, secondLine, thirdLine, writeToCheckedIndexes, writeToNumberSequence) => {
  
  const startFrom = writeToCheckedIndexes.length === 0 ? 0 : writeToCheckedIndexes[writeToCheckedIndexes.length - 1];

  const subFirstLineFromLastCheckedIndex = firstLine.substring(startFrom);
  const subSecondLineFromLastCheckedIndex = secondLine.substring(startFrom);
  const subThirdLineFromLastCheckedIndex = thirdLine.substring(startFrom);

  const indexOfFirstPipeCharacter = [
          subSecondLineFromLastCheckedIndex.indexOf('|'),
          subThirdLineFromLastCheckedIndex.indexOf('|'),
        ].sort()[0];
  const indexOfFirstDashCharacter = [
          subFirstLineFromLastCheckedIndex.indexOf('_'),
          subSecondLineFromLastCheckedIndex.indexOf('_'),
          subThirdLineFromLastCheckedIndex.indexOf('_')
        ].sort()[0];

  const isDigitOne = (indexOfFirstDashCharacter - indexOfFirstPipeCharacter) > 1;
  const isDigitThreeOrSeven = indexOfFirstDashCharacter < indexOfFirstPipeCharacter;

  let sliceLength;

  if (isDigitOne) {
    sliceLength = 1;
  } else if (isDigitThreeOrSeven) {
    sliceLength = 2;
  } else {
    sliceLength = 3;
  }

  writeToCheckedIndexes.push(startFrom+sliceLength+1);

  const digit = [
    subFirstLineFromLastCheckedIndex.substring(0, sliceLength),
    subSecondLineFromLastCheckedIndex.substring(0, sliceLength),
    subThirdLineFromLastCheckedIndex.substring(0, sliceLength),
  ];

  switch (digit.join('')) {
    case ZERO:
      writeToNumberSequence.push(0)
      break;
    case ONE:
      writeToNumberSequence.push(1)
      break;
    case TWO:
      writeToNumberSequence.push(2)
      break;
    case THREE:
      writeToNumberSequence.push(3)
      break;
    case FOUR:
      writeToNumberSequence.push(4)
      break;
    case FIVE:
      writeToNumberSequence.push(5)
      break;
    case SIX:
      writeToNumberSequence.push(6)
      break;
    case SEVEN:
      writeToNumberSequence.push(7)
      break;
    case EIGHT:
      writeToNumberSequence.push(8)
      break;
    case NINE:
      writeToNumberSequence.push(9)
      break;
    default:
      writeToNumberSequence.push('?')
      break;
  }

};

export const digestNumberSequenceLines = (firstLine, secondLine, thirdLine, writeToDigestedSequenceNumbers) => {
  const checkedIndexes = [];
  const numberSequence = []

  while (numberSequence.length < 9) {
    // parse text number into digit
    identifyNumber(firstLine, secondLine, thirdLine, checkedIndexes, numberSequence);
  }

  writeToDigestedSequenceNumbers.push(numberSequence.join(''));

};

export const brakeUpGroupedLinesIntoDigits = (groupedNumberSequenceSpecificLines, writeToListOfConvertedNumberSequences) => {
  groupedNumberSequenceSpecificLines.forEach((numberSequenceLines, index) => {
    const [firstLine, secondLine, thirdLine] = numberSequenceLines;
    const digestedSequenceNumbers = [];
    // mapping digit groups into actual digits
    digestNumberSequenceLines(firstLine, secondLine, thirdLine, digestedSequenceNumbers);
    writeToListOfConvertedNumberSequences.push(...digestedSequenceNumbers);
  });
};

export const ocr = async (inputFilePath) => {
  // reading file by lines
  
  const readFileOutputAsArrayOfLines = [];
  const groupedNumberSequenceSpecificLines = [];
  const listOfConvertedNumberSequences = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(inputFilePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    readFileOutputAsArrayOfLines.push(line);
  }

  // lets group number specific lines
  reduceOutputToGroupedLines(readFileOutputAsArrayOfLines, groupedNumberSequenceSpecificLines);

  // breaking grouped number lines into digit groups
  brakeUpGroupedLinesIntoDigits(groupedNumberSequenceSpecificLines, listOfConvertedNumberSequences);

  console.log('listOfConvertedNumberSequences', listOfConvertedNumberSequences);
  
  

  // returning list of policy numbers

  return readFileOutputAsArrayOfLines;
}
