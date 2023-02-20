import * as wordsRepository from "../repository/wordsRepository.js";
import * as kuroShiro from "./kuroshiroJpConversionService.js";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const fs = require("fs");

export const spaceTest = /\s/g; // matches spaces
const firstArgTest = / *\[[^\]]*]/; // find everything between and including []
const secondArgTest = / *\,[^\]]*;/; // find everything between and including , ;, inside of []
const thirdArgTest = / *\[[^\]]*;/; // find everything between and including [ ;
const fourthArgTest = /(.+)\[[\u3040-\u309f\u30a0-\u30ff]*,(.+);(.+)](.*)/; // matches strings containing "," inside []
const fithArgTest = / *\;[^\]]*/; // finds everything between and including ; ]
const hasKanjiTest = /([一-龯])/; // checks for Kanji

export const hasKanji = (input) => {
  return hasKanjiTest.test(input);
};

export const generateWordArr = (file) => {
  return fs
    .readFileSync(path.resolve(__dirname, `../../resources/${file}`), "utf-8")
    .split("\n")
    .join("")
    .split("\r");
};

export const isValidMigakiData = (input) => {
  return thirdArgTest.test(input);
};

export const removeSpaces = (input) => {
  return input.replace(spaceTest, "");
};

export const generadeVerbBool = (input) => {
  return fourthArgTest.test(input);
};

export const generateWord = (input) => {
  return input.replace(firstArgTest, "");
};

export const generateReading = (isVerb, input) => {
  let currReading = "";

  if (isVerb && hasKanji(input)) {
    currReading = secondArgTest
      .exec(input)[0]
      .split(",")
      .join("")
      .split(";")
      .join("");
  }

  if (!isVerb && hasKanji(input)) {
    currReading = thirdArgTest
      .exec(input)[0]
      .split("[")
      .join("")
      .split(";")
      .join("");
  }
  return currReading;
};

export const updateFalsyReading = (data, reading) => {
  while (hasKanji(data)) {
    data = data.replace(hasKanjiTest, "");
  }
  return reading + data.replace(firstArgTest, "");
};

export const generatePitch = (input) => {
  return fithArgTest.exec(input)[0].split(";").join("").split(",");
};

export const logInformation = (isVerb, word, reading, pitch) => {
  console.log(`\n`);
  console.log(`isVerb: "${isVerb}"`);
  console.log(`word: "${word}"`);
  console.log(`reading: "${reading}"`);
  console.log(`pitch: "${pitch}"`);
};

export const isValidReadingCheck = (readingLen, wordLen) => {
  return readingLen < wordLen;
};

const addDataFromFile = async (file) => {
  const wordArr = generateWordArr(file);

  for (let i = 0; i < wordArr.length; i++) {
    const currData = removeSpaces(wordArr[i]);

    if (!isValidMigakiData(currData)) {
      continue;
    }

    const isVerb = generadeVerbBool(currData);
    const currWord = generateWord(currData);
    let currReading = generateReading(isVerb, currData);
    const currPitch = generatePitch(currData);

    if (isValidReadingCheck(currReading.length, currWord.length)) {
      currReading = updateFalsyReading(currData, currReading);
    }

    currReading = kuroShiro.convertHiraToKata(currReading);

    if (
      !(await wordsRepository.getExistingSingleRow("words", "word", currWord))
    ) {
      wordsRepository.addValuesToExistingTable("words", [
        isVerb,
        currWord,
        currReading,
        currPitch,
      ]);
    }
  }
};

// addDataFromFile("originalWordList.txt");
