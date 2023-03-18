import { registerEnumType } from '@nestjs/graphql';

export enum DeployedContracts {
  SemesterStore = '0x6f2A2744F0878C519637E6e69fBb777EEAe5963B',
  CertificateStore = '0x5c7990bb563db34df0cf8ee79f235457ddca964f',
}

registerEnumType(DeployedContracts, {
  name: 'DeployedContractsEnum',
});
