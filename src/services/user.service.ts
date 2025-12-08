import { createUserRepository } from "../repository/sqlite/User.repository";
import { User } from "../model/User";
import { id, InitializableRepository } from "../repository/IRepository";

export class UserService {
  private userRepository?: InitializableRepository<User>;

  async getAllUsers(): Promise<User[]> {
    return (await this.getRepo()).getAll();
  }

  async getUserById(userId: id): Promise<User> {
    return (await this.getRepo()).get(userId);
  }

  async createUser(user: User): Promise<id> {
    return (await this.getRepo()).create(user);
  }

  async updateUser(user: User): Promise<void> {
     await (await this.getRepo()).update(user);
  }

  async deleteUser(userId: id): Promise<void> {
    await (await this.getRepo()).delete(userId);
  }

  private async getRepo() {
    if (!this.userRepository) {
      this.userRepository = await createUserRepository();
    }
    return this.userRepository;
  }
}