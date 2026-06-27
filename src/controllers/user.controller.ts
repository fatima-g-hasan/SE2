import { Request, Response } from "express";
import { User } from "../model/User";
import { UserService } from "../services/UserManagement.service";
import { generateUUID } from "../util/index";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";
import { ServiceException } from "../util/exceptions/http/ServiceException";
import logger from "../util/logger";
import { toRole } from "../config/roles";

export class UserController {
  private userService: UserService;

  constructor (userService: UserService) {
    this.userService = userService;
  }

  async getAllUser(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error){
      logger.error('Error fetching users', error);
      throw new ServiceException("Error fetching users");
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      throw new BadRequestException('User ID is required in the path');
    }
    try {
      const user = await this.userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
        logger.error('Error fetching user', error);
        throw new NotFoundException("User not found");
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const {name, email, password} = req.body;

      // validate request
      if (!name || !email || !password) {
        throw new BadRequestException('Name, email, and password are required', {
          name: !name,
          email: !email,
          password: !password
        });
      }

      // validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestException('Invalid email format');
      }

      const newUser = new User(name, email, password, generateUUID('user'), toRole('user'));
      const userId = await this.userService.createUser(newUser);

      try {
        const createdUser = await this.userService.getUserById(userId);
        res.status(201).json(createdUser);
      } catch (error) {
        logger.error('Error creating user', error);
        res.status(201).json({ message: "User created, but unable to fetch user details", id: userId });
      }
    } catch (error) {
        logger.error('Error creating user', error);
        throw new ServiceException('Error creating user');
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const {name, email, password} = req.body;

      // validate request
      if (!id) {
        throw new BadRequestException('User ID is required in the path');
      }
      if(!name && !email && !password) {
        throw new BadRequestException('At least one field is required to update user',{
          name: !name,
          email: !email,
          password: !password
        });
      }
        // get existing user
        const existingUser = await this.userService.getUserById(id);

        // update fields
        const updatedUser = new User (
          name || existingUser.name,
          email || existingUser.email,
          password || existingUser.password,
          id,
          toRole(existingUser.role)
        );

        await this.userService.updateUser(updatedUser);

        const result = await this.userService.getUserById(id);
        res.status(200).json(result);
   
    } catch (error) {
      logger.error('Error updating user', error);
        if (error instanceof BadRequestException) {
          throw error;
        }
        if ((error as Error).message === 'User not found') {
          throw new NotFoundException('User not found');
        }
        throw new ServiceException('Error updating user');
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        throw new BadRequestException('User ID is required in the path');
      }
        await this.userService.deleteUser(id);
        res.status(204).send();
    } catch (error) {
        logger.error('Error deleting user', error);
        if (error instanceof BadRequestException) {
          throw error;
        }
        if ((error as Error).message === 'User not found') {
          throw new NotFoundException('User not found');
        }
        throw new ServiceException('Error deleting user');
    }
  }
}