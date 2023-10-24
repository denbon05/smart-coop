import { useAuth } from '@/composables/auth';
import { RouteNames } from '@/types/entities/router';
import { type RouteLocationNormalized } from 'vue-router';

const auth = useAuth();

export const isMember = () => !auth.user.isGuest;

export const isGuest = (to: RouteLocationNormalized) => {
  console.log('isGuest HOOK', to);
  return auth.user.isGuest;
};

export const defineHomePage = (to: RouteLocationNormalized) => {
  if (to.name === RouteNames.COOP && auth.user.isGuest) {
    return { name: RouteNames.WELCOME };
  }

  if (to.name === RouteNames.WELCOME && !auth.user.isGuest) {
    return { name: RouteNames.COOP };
  }
};
