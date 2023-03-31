/**
 * Timestamps embed
 *
 * This is for typeorm embed field.
 * It helps to keep track of when a
 * row was created, updated and deleted
 */
import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class Timestamps {
  @CreateDateColumn()
  public createdAt!: Date;

  @IsOptional()
  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
