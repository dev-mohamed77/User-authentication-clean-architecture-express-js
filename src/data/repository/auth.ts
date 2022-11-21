import { ApiError } from "../../application/utils/error_handle";
import AuthRepository from "../../domain/repository/auth";
import { AuthDataSource } from "../data-sources/interface/auth";
import User from "../model/user";
import { inject, injectable } from "tsyringe";

@injectable()
class AuthRepositoryImp implements AuthRepository {
  auth_data_source: AuthDataSource;
  constructor(@inject("AuthDataSource") auth_data_source: AuthDataSource) {
    this.auth_data_source = auth_data_source;
  }

  async register(user: User): Promise<any[]> {
    return await this.auth_data_source.register(user);
  }

  async login(username: string): Promise<any[]> {
    return await this.auth_data_source.login(username);
  }
  logout(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async refresh_token(id: string): Promise<any[]> {
    return await this.auth_data_source.refresh_token(id);
  }
}

export = AuthRepositoryImp;
