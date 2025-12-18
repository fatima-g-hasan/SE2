import { createUserRepository, UserRepository } from "../repository/sqlite/User.repository";
import { User } from "../model/User";
import { id } from "../repository/IRepository";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";

export class UserService {
  private userRepository?: UserRepository;

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

  async validateUser(email: string, password: string): Promise<id> {
    const user: User = await (await this.getRepo()).getByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found via email');
    }
    if (user.password !== password) {
      throw new NotFoundException('Invalid password');
    }
    return user.getId();
  }

  private async getRepo() {
    if (!this.userRepository) {
      this.userRepository = await createUserRepository();
    }
    return this.userRepository;
  }
}