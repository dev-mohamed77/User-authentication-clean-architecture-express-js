import { inject, injectable } from "tsyringe";
import User from "../../../data/model/user";
import AuthRepository from "../../repository/auth";

@injectable()
export class RegisterUseCase {
  private auth_repository: AuthRepository;
  constructor(@inject("AuthRepository") auth_repository: AuthRepository) {
    this.auth_repository = auth_repository;
  }

  async execute(user: User) {
    return await this.auth_repository.register(user);
  }
}
