import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsUrl } from 'class-validator';
import { Timestamps } from 'src/core/embed/timestamps.embed';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { SemesterTypesEnum } from './enums/semester-types.enums';

@ObjectType()
@Entity('SemesterResult')
@Unique(['id', 'url'])
export class SemesterResult extends Timestamps {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  id: string;

  @IsUrl()
  @Field()
  @Column({ type: 'text', unique: true })
  url: string;

  @IsNumber()
  @Field()
  @Column({ type: 'int' })
  year: number;

  @Field()
  @Column({
    type: 'enum',
    enum: SemesterTypesEnum,
    enumName: 'SemesterTypesEnum',
  })
  type: SemesterTypesEnum;
}
