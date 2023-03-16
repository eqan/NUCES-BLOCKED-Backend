import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Timestamps } from 'src/core/embed/timestamps.embed';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { SemesterTypesEnum } from './enums/semester-types.enums';

@ObjectType()
@Entity('SemesterResult')
@Unique(['id', 'url'])
export class SemesterResult extends Timestamps {
  @IsNotEmpty()
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  @Column({ type: 'text', unique: true })
  url: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  @Column({ type: 'text' })
  year: string;

  @IsNotEmpty()
  @Field()
  @Column({
    type: 'enum',
    enum: SemesterTypesEnum,
    enumName: 'SemesterTypesEnum',
  })
  type: SemesterTypesEnum;
}
