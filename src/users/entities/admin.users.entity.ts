import { Field, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@ObjectType()
@Entity('AdminInformation')
@Unique(['id'])
export class AdminEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @IsEthereumAddress({ message: 'Wallet address should be valid' })
  @Column({ type: 'text', nullable: true })
  walletAddress?: string;

  @Field()
  @Column({ type: 'text', nullable: true })
  userSignature?: string;
}
