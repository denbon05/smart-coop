import type { CoopForm, MemberForm } from '@/types/entities/account';

export class CoopAccount implements CoopForm {
  name: string = '';
  location: string = '';
}

export class MemberAccount implements MemberForm {
  name: string = '';
  location: string = '';
  coopId: string = '';
}
