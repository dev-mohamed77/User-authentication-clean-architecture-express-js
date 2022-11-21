import { AuthDataSource } from "../interface/auth";

import connection from "../../../application/db/postgresql/connection";
import User from "../../model/user";
import { ApiError } from "../../../application/utils/error_handle";
import { injectable, singleton } from "tsyringe";

@singleton()
class AuthPostgresqlDataSource implements AuthDataSource {
  async register(params: User): Promise<any[]> {
    const check_username_or_email_exist_query = `SELECT * FROM users WHERE users_username = $1 OR users_email = $2`;

    const check_username_or_email_exist_value = [params.username, params.email];

    const check_username_or_email_exist_result = await connection(
      check_username_or_email_exist_query,
      check_username_or_email_exist_value
    );

    if (check_username_or_email_exist_result.rows.length) {
      const message = "username or email are exist";
      throw new ApiError(message, 400, message);
    }

    const query = `INSERT INTO users (users_username, users_email, users_password, users_rule, users_created_at) VALUES ($1, $2, $3, $4, $5) returning *`;
    const values = [
      params.username,
      params.email,
      params.password,
      "USER",
      params.created_at,
    ];
    const result = await connection(query, values);

    return result.rows;
  }

  async login(username: string): Promise<any[]> {
    const query = `SELECT * FROM users WHERE users_username = $1`;
    const value = [username];
    const result = await connection(query, value);
    return result.rows;
  }

  async refresh_token(id: string): Promise<any[]> {
    const query = "SELECT * FROM userS WHERE id = $1";
    const value = [id];
    const result = await connection(query, value);
    return result.rows;
  }

  logout(): void {
    throw new Error("Method not implemented.");
  }
}

export = AuthPostgresqlDataSource;
