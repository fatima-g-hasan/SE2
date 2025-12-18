import { id, InitializableRepository } from "../IRepository";
import { Database } from "sqlite";
import { ConnectionManager } from "./ConnectionManager";
import { User } from "../../model/User";

export class UserRepository implements InitializableRepository<User> {
  private db: Database | null = null;

  async init(): Promise<void> {
    this.db = await ConnectionManager.getConnection();

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
        )
      `);
  }

   async getAll(): Promise<User[]> {
    if (!this.db) {
      throw new Error ('Database not initialized');
    }

    try {
      const users = await this.db.all('SELECT * FROM users');
      return users.map(user => new User(
        user.name,
        user.email,
        user.password,
        user.id
      ));
    } catch (error) {
      throw new Error(`Failed to get all users: ${(error as Error).message}`)
    }
  }

  async get(id: id): Promise<User> {
    if (!this.db) {
      throw new Error ('Database not initialized');
    }

    try {
      const user = await this.db.get('SELECT * FROM users WHERE id = ?', id);
      if (!user) {
        throw new Error ('User not found');
      }
      return new User(
        user.name,
        user.email,
        user.password,
        user.id
      );
    } catch (error) {
      if ((error as Error).message === 'User not found') {
        throw error;
      }
      throw new Error(`Failed to get user: ${(error as Error).message}`);
    }
  }

  async create(user: User): Promise<id> {
     if (!this.db) {
      throw new Error ('Database not initialized');
    }
    try {
      const userId = user.id;

      await this.db.run(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)', 
        userId,
        user.name,
        user.email,
        user.password
      );
      return userId;
    } catch(error) {
        throw new Error (`Failed to create user: ${(error as Error).message}`);
    }
  }

  async update(user: User): Promise<void> {
    if (!this.db) {
      throw new Error ('Database not initialized');
    }

    try {
      const userId = user.getId();

      const result = await this.db.run(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        user.name,
        user.email,
        user.password,
        userId
      );

      if (result.changes === 0) {
        throw new Error('User not found');
      }
    } catch (error) {
      if ((error as Error).message === 'User not found') {
        throw error;
      }
      throw new Error (`Failed to update user: ${(error as Error).message}`);
    }
  }

  async delete(id: id): Promise<void> {
    if (!this.db) {
      throw new Error ('Database not initialized');
    }

    try {
      const result = await this.db.run('DELETE FROM users WHERE id = ?', id);
      if (result.changes === 0) {
        throw new Error('User not found');
      }
    } catch (error) {
      if ((error as Error). message === 'User not found') {
        throw error;
      }
      throw new Error(`Failed to delete user: ${(error as Error).message}`);
    }
  }

  async getByEmail(email: string): Promise<User> {
    if (!this.db) {
      throw new Error ('Database not initialized');
    }
    const user = await this.db.get('SELECT * FROM users WHERE email =?', email);
    if (!user) {
      throw new Error('User not found');
    }
    return new User(
      user.name,
      user.email,
      user.password,
      user.id
    );
  }
}

export async function createUserRepository(): Promise<UserRepository> {
  const userRepository = new UserRepository();
  await userRepository.init();
  return userRepository;
}