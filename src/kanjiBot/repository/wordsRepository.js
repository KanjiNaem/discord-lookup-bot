import { createRequire } from "module";
const require = createRequire(import.meta.url);
const sqlite3 = require("sqlite3").verbose();

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sql;

const db = new sqlite3.Database(
  path.resolve(__dirname, "../../resources/wordData.db"),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

export const getExistingSingleRow = (table, word) => {
  sql = `SELECT * FROM ${table} WHERE word = ?`;
  return new Promise((resolve) => {
    db.get(sql, [word], (err, row) => {
      if (err) return console.error(err.message);
      resolve(row);
    });
  });
};

export const insertUnknownWord = (word) => {
  sql = `INSERT INTO unknownWords(word) VALUES(?)`;
  db.run(sql, [word], (err) => {
    if (err) return console.error(err.message);
  });
};

export const createTable = (newTable) => {
  sql = `CREATE TABLE ${newTable}(id INTEGER PRIMARY KEY,word)`;
  db.run(sql);
};

export const dropTable = (table) => {
  sql = `DROP TABLE ${table}`;
  db.run(sql);
};

export const queryData = (table) => {
  sql = `SELECT * FROM ${table}`;
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    rows.forEach((row) => {
      console.log(row);
    });
  });
};

export const deleteWord = (table, word) => {
  sql = `DELETE FROM ${table} WHERE word = ?`;
  db.get(sql, [word], (err) => {
    if (err) return console.error(err.message);
  });
};

export const deleteAllEntries = (table) => {
  sql = `DELETE FROM ${table}`;
  db.all(sql, [], (err) => {
    if (err) return console.error(err.message);
  });
};

export const getWord = (table, word) => {
  sql = `SELECT * FROM ${table} WHERE word = ?`;
  db.get(sql, [word], (err, row) => {
    if (err) return console.error(err.message);
    return row
      ? console.log(row.id, row.isVerb, row.word, row.reading, row.pitch)
      : console.log(`cannot find the word ${word}`);
  });
};

export const getDataByWord = (word) => {
  const sql = `SELECT * FROM words WHERE word = ?`;
  return executeGetQuery(sql, [word]);
};

export const getDataByReading = (word) => {
  const sql = `SELECT * FROM words WHERE reading = ?`;
  return executeGetQuery(sql, [word]);
};

export const addToMainWords = (isVerb, word, reading, pitch) => {
  sql = `INSERT INTO words(isVerb,word,reading,pitch) VALUES(?,?,?,?)`;
  db.run(sql, [isVerb, word, reading, pitch], (err) => {
    if (err) return console.error(err.message);
  });
};

const executeGetQuery = (query, args) => {
  return new Promise((resolve) => {
    db.get(query, args, (err, row) => {
      if (err) return console.error(err.message);
      resolve(row);
    });
  });
};
