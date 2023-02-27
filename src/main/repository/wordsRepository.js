import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const require = createRequire(import.meta.url);
const sqlite3 = require("sqlite3").verbose();
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

export const queryData = (table) => {
  sql = `SELECT * FROM ${table}`;
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    rows.forEach((row) => {
      console.log(row);
    });
  });
};

export const getExistingSingleRow = async (table, column, word) => {
  sql = `SELECT * FROM ${table} WHERE ${column} = ?`;
  return await executeGetQuery(sql, [word]);
};

export const addValuesToExistingTable = (table, insertVal) => {
  sql =
    table === "words"
      ? `INSERT INTO words(isVerb,word,reading,pitch) VALUES(?,?,?,?)`
      : table === "unknownWords"
      ? `INSERT INTO unknownWords(word) VALUES(?)`
      : "invalid";

  if (sql === "invalid") {
    throw new Error(`${table} does not exist`);
  }
  executeRunQuery(sql, insertVal);
};

const executeRunQuery = (query, args) => {
  db.run(query, args, (err) => {
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

const createTable = (newTable) => {
  sql = `CREATE TABLE ${newTable}(id INTEGER PRIMARY KEY,word)`;
  db.run(sql);
};

const dropTable = (table) => {
  sql = `DROP TABLE ${table}`;
  db.run(sql);
};

const deleteWord = async (table, word) => {
  sql = `DELETE FROM ${table} WHERE word = ?`;
  await executeGetQuery(sql, [word]);
};

const deleteIdRange = async (table, idBegin, idEnd) => {
  sql = `DELETE FROM ${table} WHERE id = ?`;
  if (idBegin > idEnd) {
    throw new Error(
      `idBegin ${idBegin} needs to be smaller or equal to idEnd ${idEnd}`
    );
  }
  for (let i = idEnd - idBegin; i >= 0; i--) {
    await executeGetQuery(sql, idBegin + i);
  }
};

const deleteAllEntries = (table) => {
  sql = `DELETE FROM ${table}`;
  db.all(sql, [], (err) => {
    if (err) return console.error(err.message);
  });
};
