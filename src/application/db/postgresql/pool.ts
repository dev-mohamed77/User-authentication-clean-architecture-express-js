import { Pool } from "pg";

const db_config = {
  host: "localhost",
  port: 5432,
  database: "pixel_store",
  user: "postgres",
  password: "Mohamed@123",
  connectionTimeoutMillis: 300,
  max: 4,
};

const pool = new Pool(db_config);

pool.on("connect", (connect) => {
  console.log("connect" + connect);
});

pool.on("error", (err: Error) => {
  console.log(`Error in Database + ${err.message}`);
});

export = pool;
