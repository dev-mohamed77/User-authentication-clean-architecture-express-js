import User from "../../model/user";

export interface AuthDataSource {
  register(params: User): Promise<any[]>;
  login(username: string): Promise<any[]>;
  logout(): void;
  refresh_token(id: string): Promise<any[]>;
}
