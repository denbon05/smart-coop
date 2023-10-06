import type { ZodString } from 'zod';

export enum AccountType {
  COOP,
  MEMBER,
}

export type AccountData = {
  name: ZodString;
  location: ZodString;
  email: ZodString;
};
