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
  return data
    ? `言葉 : ${data.word}\n読み方 : ${data.reading}\nアクセント : ${data.pitch}\n辞書 : https://jisho.org/search/${data.word}`
    : `cannot find the word ${data}`;
};

const getData = async (input) => {
  let data;

  if (migakiParcingService.hasKanji(input)) {
    data = await wordsRepository.getExistingSingleRow("words", "word", input);
    return data;
  }

  if (kuroshiro.consistsOfHiragana(input)) {
    const kataConverted = kuroshiro.convertHiraToKata(input);
    data = await wordsRepository.getExistingSingleRow(
      "words",
      "reading",
      kataConverted
    );

    if (!data) {
      wordsRepository.addValuesToExistingTable("unknownWords", [input]);
    }
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
