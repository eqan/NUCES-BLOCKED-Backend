import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { DeleteUsersInput } from './dto/delete-users.input';
import { FilterUserDto } from './dto/filter.users.dto';
import { GetAllUsers } from './dto/get-all-users.dto';
import { LoginUserInput } from './dto/logged-user.input';
import { LoggedUserOutput } from './dto/logged-user.output';
import { UpdateUsersInput } from './dto/update-user.input';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver(() => Users)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}
  /**
   * Login User
   * @param LoggedUserInput: message, signature, address
   * @returns access token
   */
  @Mutation(() => LoggedUserOutput, { name: 'LoginUser' })
  loginUser(
    @Args('LoginUserInput') loginUserInput: LoginUserInput,
  ): Promise<{ access_token: string }> {
    const token = this.userService.loginUser(loginUserInput);
    return token;
  }

  /**
   * Create User
   * @param createUsersInput
   * @returns Users
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Users, { name: 'CreateUser' })
  async create(
    @Args('CreateUserInput') createUsersInput: CreateUserInput,
  ): Promise<Users> {
    try {
      return await this.userService.create(createUsersInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete User
   * @param deleteUserInput
   * @returns void
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Users, { name: 'DeleteUser', nullable: true })
  async delete(
    @Args('DeleteUserInput')
    deleteUserInput: DeleteUsersInput,
  ): Promise<void> {
    try {
      await this.userService.delete(deleteUserInput);
      return null;
    } catch (error) {}
  }

  /**
   * Update User Status
   * @param updateUserStatus
   * @returns Updated User
   */
  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Users, { name: 'UpdateUser' })
  async edit(
    @Args('UpdateUserInput')
    updateUserStatus: UpdateUsersInput,
  ): Promise<Users> {
    try {
      return await this.userService.update(updateUserStatus);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get User By address
   * @param id
   * @returns User
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => Users, { name: 'GetUserDataByUserEmail', nullable: true })
  async show(@Args('userEmail') id: string): Promise<Users> {
    try {
      return await this.userService.show(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALl Users
   * @param filterUserDto
   * @returns Searched or all users
   */
  // @UseGuards(JwtAuthGuard)
  @Query(() => GetAllUsers, {
    name: 'GetAllUsers',
  })
  async index(
    @Args('filterUserDto', { nullable: true, defaultValue: {} })
    filterUserDto: FilterUserDto,
  ): Promise<GetAllUsers> {
    try {
      return await this.userService.index(filterUserDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
