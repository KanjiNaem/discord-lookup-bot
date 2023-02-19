import * as migakiParcingService from "./migakiParcingService.js";
import * as wordsRepository from "../repository/wordsRepository.js";
import * as kuroshiro from "./kuroshiroJpConversionService.js";

export const lookup = async (input) => {
  const data = await getData(input);
  return lookupReply(data);
};

const lookupReply = async (data) => {
  if (data) {
    // console.log(
    //   `言葉 : ${data.word}\n読み方 : ${data.reading}\nアクセント : ${data.pitch}\n辞書 : https://jisho.org/search/${data.word}`
    // );
    return `言葉 : ${data.word}\n読み方 : ${data.reading}\nアクセント : ${data.pitch}\n辞書 : https://jisho.org/search/${data.word}`;
  }
  // console.log("doesnt work");
  insertUnknownWord(data);
  return `cannot find the word ${data}`;
};

const getData = async (input) => {
  let data;

  if (migakiParcingService.hasKanji(input)) {
    data = await wordsRepository.getDataByWord(input);
  }

  if (kuroshiro.consistsOfHiragana(input)) {
    input = await kuroshiro.convertHiraToKata(input);
    data = await wordsRepository.getDataByReading(input);
  }

  if (kuroshiro.consistsOfKatakana(input)) {
    data = await wordsRepository.getDataByReading(input);
  }

  return data;
};

const insertUnknownWord = async (word) => {
  if (!(await wordsRepository.getExistingSingleRow("unknownWords", word))) {
    wordsRepository.insertUnknownWord(word);
  }
};

// const query = "あい";
// const data = await getData(query);
// lookupReply(data);

// const word = "あい";
// const result = await getData(word);
// console.log(result);

// fix hiragana queries, they're not working rn
