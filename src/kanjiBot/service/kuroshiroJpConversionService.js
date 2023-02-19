import { createRequire } from "module";
import * as migakiParcingService from "./migakiParcingService.js";
import * as wordsRepository from "../repository/wordsRepository.js";
const require = createRequire(import.meta.url);

const kuroshiro = require("kuroshiro");

export const convertHiraToKata = async (input) => {
  if (migakiParcingService.hasKanji(input)) {
    throw new Error(
      `${input} contains Kanji when it should only consist of Hiragana`
    );
  }
  const result = kuroshiro.Util.kanaToKatakana(input);
  return result;
};

export const consistsOfHiragana = (input) => {
  return !kuroshiro.Util.hasKanji(input) && !kuroshiro.Util.hasKatakana(input);
};

export const consistsOfKatakana = (input) => {
  return !kuroshiro.Util.hasKanji(input) && !kuroshiro.Util.hasHiragana(input);
};

// const input = "ことば";
// const data = migakiParcingService.hasKanji(input)
//   ? await wordsRepository.getDataByWord(input)
//   : consistsOfHiragana(input)
//   ? await wordsRepository.getDataByReading(await convertHiraToKata(input))
//   : await wordsRepository.getDataByReading(input);

// console.log(data);

// const hiraWord = "ことば";
// const kataWord = await convertHiraToKata(hiraWord);
// console.log(kataWord);

// const data = await wordsRepository.getDataByReading(
//   await convertHiraToKata(hiraWord)
// );
// console.log(data);
