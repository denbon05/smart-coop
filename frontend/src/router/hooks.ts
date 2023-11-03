import { useAuth } from '@/composables/auth';
import { RouteNames } from '@/types/entities/router';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

const auth = useAuth();

export const onlyMember = () => {
  console.log('onlyMember isGuest', auth.user.isGuest);
  if (auth.user.isGuest) {
    return { name: RouteNames.WELCOME };
  }
};

export const onlyGuest = () => {
  console.log('onlyGuest isGuest', auth.user.isGuest);
  if (!auth.user.isGuest) {
    return { name: RouteNames.COOP };
  }
};
