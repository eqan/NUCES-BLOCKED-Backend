import { registerEnumType } from '@nestjs/graphql';

export enum DeployedContracts {
  SemesterStore = '0x9d90e940066828e239Ba4D24CA5e9534aA20970F',
  CertificateStore = '0xc26D8b7aa73461383FA179804DB0Cb2f0d911527',
  DAO = '0x4863065014A77A6F113411661e1D9081483667F3',
}

registerEnumType(DeployedContracts, {
  name: 'DeployedContractsEnum',
});
