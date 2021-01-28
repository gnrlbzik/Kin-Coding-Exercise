import { ocr } from './ocr.js';

const filePath = './mock-data/funky-policy-numbers.txt'

await ocr(filePath);
// console.log('aaa', await ocr(filePath));