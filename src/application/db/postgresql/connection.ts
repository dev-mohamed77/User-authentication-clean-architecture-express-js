import { QueryResult } from "pg";
import pool from "./pool";

const connection = async (query: string, value?: any[]) => {
  return new Promise<QueryResult>((resolve, reject) => {
    pool.connect((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(query, value!, (err, result) => {
          connection.release();
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    });
  });
};

export = connection;
