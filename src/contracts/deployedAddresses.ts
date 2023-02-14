import { registerEnumType } from '@nestjs/graphql';

export enum DeployedContracts {
  SemesterStore = '0x108535cE9b2e6536bC9F5bA0694d8DA256d87a69',
  CertificateStore = '0x7C1B33551E246806301Ecf2633dfFB44EA792D75',
}

registerEnumType(DeployedContracts, {
  name: 'DeployedContractsEnum',
});
