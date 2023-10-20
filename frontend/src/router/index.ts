import { AccountType } from '@/types/entities/account';
import { RouteNames } from '@/types/entities/router';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import NotFound from '../views/NotFound.vue';
import WelcomeView from '../views/WelcomeView.vue';
import { isGuest, isMember } from './permissions';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // route level code-splitting
  // this generates a separate chunk (About.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  routes: [
    // will match everything and put it under `$route.params.pathMatch`
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    // home page for guest
    {
      path: '/',
      name: RouteNames.WELCOME,
      component: WelcomeView,
      beforeEnter: [isGuest],
      children: [
        {
          path: 'auth',
          name: RouteNames.AUTH,
          children: [
            {
              path: 'coop',
              name: RouteNames.AUTH_COOP,
              props: { accountType: AccountType.COOP },
              component: () => import('../views/AuthView.vue'),
            },
            {
              path: 'coop',
              name: RouteNames.JOIN_COOP,
              props: { accountType: AccountType.MEMBER },
              component: () => import('../views/AuthView.vue'),
            },
          ],
        },
      ],
    },
    // home page for member of the coop
    {
      path: '/',
      name: RouteNames.HOME,
      component: HomeView,
      beforeEnter: [isMember],
      children: [
        {
          name: RouteNames.NEW_PROPOSAL,
          path: 'new-proposal',
          component: () => import('@/components/coop/NewProposal.vue'),
        },
        {
          name: RouteNames.PROPOSALS,
          path: 'proposals',
          component: () => import('@/components/coop/ProposalList.vue'),
        },
        // {
        //   name: 'coop-discover',
        //   path: 'discover',
        //   component: () => import('@/components/coop/DiscoverCoop.vue'),
        // },
        {
          name: RouteNames.PROPOSAL_HISTORY,
          path: 'proposal-history',
          component: () => import('@/components/coop/ProposalList.vue'),
        },
      ],
    },
    {
      path: '/member',
      name: RouteNames.ACCOUNT,
      component: () => import('../views/MemberView.vue'),
      beforeEnter: [isMember],
    },
  ],
});

export default router;
