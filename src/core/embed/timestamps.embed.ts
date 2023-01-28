/**
 * Timestamps embed
 *
 * This is for typeorm embed field.
 * It helps to keep track of when a
 * row was created, updated and deleted
 */
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class Timestamps {
  @CreateDateColumn({
    default: () => "CURRENT_TIMESTAMP(6) AT TIME ZONE 'Asia/Karachi'",
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    default: () => "CURRENT_TIMESTAMP(6) AT TIME ZONE 'Asia/Karachi'",
  })
  public updatedAt!: Date;
}
