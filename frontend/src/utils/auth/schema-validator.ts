import { AccountType, type AccountData } from '@/types/entities/account';
import { z } from 'zod';

export const accountSchema = z.object({
  accountType: z.nativeEnum(AccountType),
  memberData: z.object<AccountData>({
    location: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});
