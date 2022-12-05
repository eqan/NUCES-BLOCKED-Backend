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
      throw new BadRequestException(SystemErrors.CREATE_USER);
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
      throw new BadRequestException({
        message: SystemErrors.GET_USER_DATA_BY_ID,
      });
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
      const { id, ...rest } = updateUsersInput;
      await this.usersRepo.update({ id }, rest);
      return this.show(id);
    } catch (error) {
      throw new BadRequestException(SystemErrors.UPDATE_USER);
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
      throw new BadRequestException(SystemErrors.DELETE_USER);
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
      const [items, total] = await Promise.all([
        this.usersRepo.find({
          where: {
            id: rest?.id,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.usersRepo.count({
          where: {
            id: rest.id,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(SystemErrors.FIND_USERS);
    }
  }
}
