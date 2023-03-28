import { registerEnumType } from '@nestjs/graphql';

export enum DeployedContracts {
  SemesterStore = '0x9d90e940066828e239Ba4D24CA5e9534aA20970F',
  CertificateStore = '0xE77183C28cFC407aC7113F9884D84b67Cdbad715',
}

registerEnumType(DeployedContracts, {
  name: 'DeployedContractsEnum',
});
