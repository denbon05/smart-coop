import type { CoopMember } from '@/types/entities/account';

/** mock for polymorphism */
class Guest implements CoopMember {
  coop = { id: '', name: '', location: '' };
  isGuest = true;
  name = '';
  location = '';
  coopId = '';
}

export default Guest;
