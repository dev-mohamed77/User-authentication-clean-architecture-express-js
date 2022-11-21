import User from "../../data/model/user";

interface AuthRepository {
  register(user: User): Promise<any[]>;
  login(username: string): Promise<any[]>;
  logout(): void;
  refresh_token(id: string): Promise<any[]>;
}

export = AuthRepository;
