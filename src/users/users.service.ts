import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { SystemErrors } from 'src/constants/errors.enum';
import { FilterUserDto } from 'src/users/dto/filter.users.dto';
import { In, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { GetAllUsers } from './dto/get-all-users.dto';
import { LoginUserInput } from './dto/logged-user.input';
import { UpdateUsersInput } from './dto/update-user.input';
import { Users } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { UserTypes } from './entities/enum/user.types.enums';
import { GetUserType } from './dto/get-user-type.output.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
    private authService: AuthService,
  ) {}

  /**
   * Create User
   * @params createUse
   * @return Users
   */
  async create(createUserInput: CreateUserInput) {
    try {
      const oldUser = await this.usersRepo.findOneBy({
        email: createUserInput.email,
      });
      if (oldUser)
        throw new BadRequestException(SystemErrors.USER_ALREADY_PRESENT);
      const saltOrRounds = 10;
      const password = createUserInput.password;
      createUserInput.password = await bcrypt.hash(password, saltOrRounds);
      const user = this.usersRepo.create(createUserInput);
      return this.usersRepo.save(user);
    } catch (error) {
      if (error.message == SystemErrors.USER_ALREADY_PRESENT)
        throw new BadRequestException(SystemErrors.USER_ALREADY_PRESENT);
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Data By User Address
   * @param email
   * @returns userData
   */
  async show(email: string): Promise<Users> {
    try {
      const userData = await this.usersRepo.findOneBy({ email });
      if (!userData) return null;
      return userData;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Data By User Address
   * @param email
   * @returns userData
   */
  async showUserType(email: string): Promise<GetUserType> {
    try {
      const { type, subType } = await this.usersRepo.findOneBy({ email });
      if (!type) return null;
      return { type, subType };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Login User and update user signature and message if required
   * @param LoggedUserInput: message, signature, address
   * @returns access token
   */
  async loginUser(loginUserInput: LoginUserInput) {
    let user = await this.show(loginUserInput.email);
    if (user) {
      user = await this.authService.validateUser(loginUserInput, user.password);
    }
    if (!user) {
      throw new BadRequestException(SystemErrors.EMAIL_OR_PASSWORD_INCORRECT);
    } else {
      return this.authService.generateUserCredentials(user);
    }
  }

  /**
   * Update Users Attributes
   * @param updateUsersInput
   * @returns updated user
   */
  async update(updateUsersInput: UpdateUsersInput): Promise<Users> {
    try {
      const { email, ...rest } = updateUsersInput;
      const { id } = await this.usersRepo.findOne({ where: { email } });
      await this.usersRepo.update({ id }, rest);
      return await this.usersRepo.findOne({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DELETE Users
   * @param deleteUsers
   * @returns Message that user successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.usersRepo.delete({ id: In(ids) });
      return null;
    } catch (error) {
      // console.log(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Users ... With Filters
   * @@params No Params
   * @returns Array of Users and Total Number of Users
   */
  async index(filterDto: FilterUserDto): Promise<GetAllUsers> {
    try {
      const { page = 1, limit = 20, ...rest } = filterDto;
      const query = this.usersRepo
        .createQueryBuilder('user')
        .where('user.name LIKE :name OR user.email LIKE :email', {
          name: `%${rest.id}%`,
          email: `%${rest.id}%`,
        })
        .skip((page - 1) * limit || 0)
        .take(limit || 10);

      return {
        items: await query.getMany(),
        total: await query.getCount(),
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
