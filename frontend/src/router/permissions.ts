import { useAuth } from '@/composables/auth';
// import type { RouteLocationNormalized } from 'vue-router';

const auth = useAuth();

export const isMember = () => !auth.user.isGuest;

export const isGuest = () =>
  // to: RouteLocationNormalized,
  // from: RouteLocationNormalized
  auth.user.isGuest;
