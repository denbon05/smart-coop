export enum AccountType {
  COOP,
  MEMBER,
}

export type AccountData = {
  name: string;
  location: string;
  email: string;
};

export type GovernorAccount = {
  accountType: AccountType;
  exists?: boolean;
} & AccountData;
