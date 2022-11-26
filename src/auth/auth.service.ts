import { verifyMessage } from '@ethersproject/wallet';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserInput } from 'src/users/dto/logged-user.input';

@Injectable()
export class AuthService {
  constructor(private readonly jwtTokenService: JwtService) {}

  /**
   * Verify wallet and return signer address
   * @params message, signature and address
   * @return signer address
   */
  async verifyWalletAndReturnSignerAddress(
    message: string,
    signature: string,
    address: string,
  ) {
    try {
      const signerAddr = verifyMessage(message, signature);
      if (signerAddr != address) {
        return false;
      }
      return signerAddr;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Validate user and return signer address or null value
   * @params message, signature and address
   * @return signer address
   */
  async validateUser(
    loginUserInput: LoginUserInput,
    password: string,
  ): Promise<any> {
    if (await bcrypt.compare(loginUserInput.password, password)) {
      delete loginUserInput.password;
      return loginUserInput;
    }
    return null;
  }

  /**
   * Generate User Access Token and save it into the cookies
   * @params message, signature and address
   * @return access token
   */
  async generateUserCredentials(user: Users) {
    const payload = {
      email: user.email,
      name: user.name,
      role: user.type,
      sub: user.id,
    };

    const token = this.jwtTokenService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
    return {
      access_token: token,
    };
  }
}
