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

  // @Field(() => Users)
  // @OneToOne(() => Users, (user) => user.id)
  // @JoinColumn({ name: 'id' })
  // user: Users;

  // @OneToOne(() => Users, (users) => users.id)
  // // @JoinColumn({ name: 'id' })
  // users: Users;

  // @Field(() => Users)
  // @OneToOne(() => Users, (user) => user.id)
  // @JoinColumn({ name: 'id' })
  // user: Users;

  // @BeforeInsert()
  // setId() {
  //   if (!this.id) {
  //     this.id = this.user.id;
  //   }
  // }
}
