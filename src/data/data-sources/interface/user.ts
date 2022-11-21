interface UserDataSource<T> {
  get_user_by_id(id: string): Promise<T>;
  get_all_user(): Promise<T[]>;
  update_user_by_id(user: T): Promise<T>;
  delete_user_by_id(id: string): void;
}
