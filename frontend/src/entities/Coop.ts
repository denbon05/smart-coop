import type { CoopForm } from '@/types/entities/account';

class Cooperative implements CoopForm {
  name: string | null;
  location: string;

  constructor({ location, name }: CoopForm) {
    this.location = location;
    this.name = name;
  }
}

export default Cooperative;
