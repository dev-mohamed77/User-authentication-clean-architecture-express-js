import { inject, injectable } from "tsyringe";
import AuthRepository from "../../repository/auth";

@injectable()
class LoginUseCase {
  private auth_repo: AuthRepository;
  constructor(@inject("AuthRepository") auth_repo: AuthRepository) {
    this.auth_repo = auth_repo;
  }

  async execute(username: string) {
    const result = await this.auth_repo.login(username);
    return result;
  }
}

export default LoginUseCase;
