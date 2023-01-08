import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';

@InputType('CreateAdminEntityInput')
export class CreateAdminEntity {
  @Field()
  @IsEthereumAddress({ message: 'Wallet address should be valid' })
  walletAddress: string;

  @Field()
  userSignature: string;
}
