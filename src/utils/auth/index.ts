import {
  AccountType,
  type AccountData,
  type GovernorAccount,
} from '@/types/entities/account';

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

  parse = (): GovernorAccount =>
    ({
      accountType: this.accountType,
      ...this.memberData,
    }) as GovernorAccount;
}
