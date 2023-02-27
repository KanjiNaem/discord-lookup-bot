import { createRequire } from "module";
import * as migakiParcingService from "./migakiParcingService.js";
const require = createRequire(import.meta.url);

const kuroshiro = require("kuroshiro");

export const convertHiraToKata = (input) => {
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
