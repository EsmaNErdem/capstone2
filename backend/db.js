// "use strict";

// /** Database setup for book club app. */
// const { Client } = require("pg");
// const { getDatabaseUri } = require("./config");

// let db;

// if (process.env.NODE_ENV === "production") {
//   db = new Client({
//     connectionString: getDatabaseUri(),
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });
// } else {
//   db = new Client({
//     connectionString: getDatabaseUri()
//   });
// }

// db.connect();

// module.exports = db;



/** Database setup for development. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    host: "/var/run/postgresql/",
    database: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new Client({
    host: "/var/run/postgresql/",
    database: getDatabaseUri()
  });
}

const connectToDatabase = async () => {
  await db.connect();
}

connectToDatabase()


module.exports = db;