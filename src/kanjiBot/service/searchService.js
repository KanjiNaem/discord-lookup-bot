import * as migakiParcingService from "./migakiParcingService.js";
import * as wordsRepository from "../repository/wordsRepository.js";
import * as kuroshiro from "./kuroshiroJpConversionService.js";

export const search = async (input) => {
  if (migakiParcingService.spaceTest.test(input)) {
    return `your input: ${input}, should not contain any spaces`;
  }
  const data = await getData(input);
  return searchReply(data);
};

const searchReply = async (data) => {
  if (data) {
    return `言葉 : ${data.word}\n読み方 : ${data.reading}\nアクセント : ${data.pitch}\n辞書 : https://jisho.org/search/${data.word}`;
  }
  wordsRepository.addValuesToExistingTable("unknownWords", [data]);
  return `cannot find the word ${data}`;
};

const getData = async (input) => {
  let data;

  if (migakiParcingService.hasKanji(input)) {
    data = await wordsRepository.getExistingSingleRow("words", "word", input);
    return data;
  }

  if (kuroshiro.consistsOfHiragana(input)) {
    const inputHi = await kuroshiro.convertHiraToKata(input);
    data = await wordsRepository.getExistingSingleRow(
      "words",
      "reading",
      inputHi
    );
    return data;
  }

  if (kuroshiro.consistsOfKatakana(input)) {
    data = await wordsRepository.getExistingSingleRow(
      "words",
      "reading",
      input
    );
    return data;
  }

  throw new Error(
    `${input} is not a valid input since it does not consist entirely of japanese characters`
  );
};

const insertUnknownWord = async (input) => {
  if (
    !(await wordsRepository.getExistingSingleRow("unknownWords", "word", input))
  ) {
    wordsRepository.insertUnknownWord(input);
  }
};
