import { AccountType, type AccountData } from '@/types/entities/account';
import { accountSchema } from './schema-validator';

export class Account {
  accountType?: AccountType;
  memberData?: AccountData;

  /** humanize the account type */
  getAccountType = () =>
    this.accountType === AccountType.COOP ? 'Cooperative' : 'Member';

  setAccountType = (accountType: AccountType) => {
    this.accountType = accountType;
  };

  setAccountData = (data: AccountData) => {
    this.memberData = data;
  };

  parse = () => accountSchema.parse(this);
}
