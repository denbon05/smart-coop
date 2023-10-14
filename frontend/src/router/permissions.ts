import { useAuth } from '@/composables/auth';
import type { RouteLocationNormalized } from 'vue-router';

const auth = useAuth();

export const isMember = () => auth.account?.isMember;

export const isGuest = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => !auth.account?.isMember;
