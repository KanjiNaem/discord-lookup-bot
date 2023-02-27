import * as wordsRepository from "../main/repository/wordsRepository.js";
import * as migakiParcingService from "../main/service/migakiParcingService.js";
import * as kuroShiro from "../main/service/kuroshiroJpConversionService.js";

const logTable = (table) => {
  wordsRepository.queryData(table);
};

const containsWord = async (table, word) => {
  const promise = await wordsRepository.getExistingSingleRow(
    table,
    "word",
    word
  );
  return promise
    ? console.log(promise)
    : console.log(`the table ${table} does not contain: ${word}`);
};

const logGeneratedEntries = async (file) => {
  const wordArr = migakiParcingService.generateWordArr(file);

  for (let i = 0; i < wordArr.length; i++) {
    const currData = migakiParcingService.removeSpaces(wordArr[i]);

    if (!migakiParcingService.isValidMigakiData(currData)) {
      console.log(
        `================= ${currData} is not valid migaki data! =================`
      );
      continue;
    }

    const isVerb = migakiParcingService.generadeVerbBool(currData);
    const currWord = migakiParcingService.generateWord(currData);
    let currReading = migakiParcingService.generateReading(isVerb, currData);
    const currPitch = migakiParcingService.generatePitch(currData);

    if (
      migakiParcingService.isValidReadingCheck(
        currReading.length,
        currWord.length
      )
    ) {
      console.log("----------> UPDATED READING <---------- ");
      currReading = migakiParcingService.updateFalsyReading(
        currData,
        currReading
      );
    }

    currReading = kuroShiro.convertHiraToKata(currReading);

    migakiParcingService.logInformation(
      isVerb,
      currWord,
      currReading,
      currPitch
    );

    if (
      !(await wordsRepository.getExistingSingleRow("words", "word", currWord))
    ) {
      console.log(
        `---------------------> word is added <---------------------`
      );
    }
  }
};

// logTable("words");
// logGeneratedEntries("toAddWords.txt");
// containsWord("words", "変態");
