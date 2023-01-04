import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType('CreateAdminEntity')
export class CreateAdminEntity {
  @Field({ nullable: true })
  @IsEthereumAddress({ message: 'Wallet address should be valid' })
  walletAddress?: string;

  @Field({ nullable: true })
  userSignature?: string;
}
