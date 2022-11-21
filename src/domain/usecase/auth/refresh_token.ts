import { inject, injectable } from "tsyringe";
import AuthRepository from "../../repository/auth";

@injectable()
class RefreshTokenUseCase {
  private auth_repo: AuthRepository;
  constructor(@inject("AuthRepository") auth_repo: AuthRepository) {
    this.auth_repo = auth_repo;
  }

  async execute(id: string) {
    return await this.auth_repo.refresh_token(id);
  }
}

export default RefreshTokenUseCase;
