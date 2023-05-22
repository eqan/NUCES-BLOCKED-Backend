import { registerEnumType } from '@nestjs/graphql';

export enum ProposalStatusEnum {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

registerEnumType(ProposalStatusEnum, {
  name: 'ProposalStatusEnum',
  description: 'Types of statuses for proposal',
});
