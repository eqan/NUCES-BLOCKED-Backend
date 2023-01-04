import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@InputType('AdminInformation')
export class AdminEntity {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Field()
  @IsEthereumAddress({ message: 'Wallet address should be valid' })
  @Column({ type: 'text', nullable: true })
  walletAddress?: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  userSignature?: string;
}
