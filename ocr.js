
import fs from 'fs';
import readline from 'readline';

export const ocr = async (inputFilePath) => {
  // reading file by lines
  
  const readFileOutputAsArrayOfLines = []
  const groupedNumberSpecificLines = []

  const rl = readline.createInterface({
    input: fs.createReadStream(inputFilePath),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    readFileOutputAsArrayOfLines.push(line);
  }

  // lets group number specific lines

  readFileOutputAsArrayOfLines.reduce((accumulator, currentValue, currentIndex, sourceArray) => {
    const {length} = accumulator;

    if (!Array.isArray(accumulator[length-1]) || accumulator[length-1].length === 3) {
      accumulator[length] = [];
    }

    if (currentValue.length > 0) {
      (accumulator[length] || accumulator[length-1]).push(currentValue);
    }

    return accumulator
  }, groupedNumberSpecificLines)

  // breaking grouped number lines into digit groups

  // console.log('groupedNumberSpecificLines', groupedNumberSpecificLines);

  const [lineOne, lineTwo, lineThree] = groupedNumberSpecificLines[0];

  


  console.log(lineOne, lineTwo, lineThree);


  
  // mapping digit groups into actual digits

  // returning list of policy numbers

  return readFileOutputAsArrayOfLines;
}
