import type { Coop } from '@/types/backend-api';
import type { CoopMember } from '@/types/entities/account';

class Member implements CoopMember {
  isGuest = false;
  name: string;
  location: string;
  coopId: Coop['id'];
  coop: Coop;

  constructor({ location, name, coopId, coop }: Omit<CoopMember, 'isGuest'>) {
    this.name = name;
    this.location = location;
    this.coopId = coopId;
    this.coop = coop;
  }
}

export default Member;
