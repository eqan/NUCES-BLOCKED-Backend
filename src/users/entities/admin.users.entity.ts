import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { Column } from 'typeorm';

@ObjectType('AdminEntity')
@InputType('AdminEntityInput')
export class AdminEntity {
  @Field()
  @IsEthereumAddress({ message: 'Wallet address should be valid' })
  @Column({ type: 'text', nullable: true })
  walletAddress: string;

  @Field()
  @Column({ type: 'text' })
  userSignature: string;
}
