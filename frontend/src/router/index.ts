import { AccountType } from '@/types/entities/account';
import { RouteNames } from '@/types/entities/router';
import { createRouter, createWebHistory } from 'vue-router';
import CoopView from '../views/CoopView.vue';
import NotFound from '../views/NotFound.vue';
import WelcomeView from '../views/WelcomeView.vue';
import { defineHomePage, isGuest, isMember } from './hooks';
import { useAuth } from '@/composables/auth';

const auth = useAuth();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // route level code-splitting
  // this generates a separate chunk (About.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  routes: [
    // will match everything and put it under `$route.params.pathMatch`
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },

    // redirect from root path to available to the user
    {
      path: '/',
      name: RouteNames.HOME,
      redirect: {
        name: auth.user.isGuest ? RouteNames.WELCOME : RouteNames.COOP,
      },
    },

    // home page for guest
    {
      path: '/welcome',
      name: RouteNames.WELCOME,
      component: WelcomeView,
      beforeEnter: [defineHomePage, isGuest],
    },

    // home page for member of the coop
    {
      path: '/coop',
      name: RouteNames.COOP,
      component: CoopView,
      beforeEnter: [defineHomePage, isMember],
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
          children: [
            {
              name: RouteNames.PROPOSAL_DISCOVER,
              path: ':proposalAddress',
              component: () => import('@/components/coop/DiscoverProposal.vue'),
            },
          ],
        },
        {
          name: RouteNames.COOP_DISCOVER,
          path: 'discover',
          component: () => import('@/components/coop/DiscoverCoop.vue'),
        },
        {
          name: RouteNames.PROPOSAL_HISTORY,
          path: 'proposal-history',
          component: () => import('@/components/coop/ProposalList.vue'),
          children: [
            {
              name: RouteNames.PROPOSAL_DISCOVER,
              path: ':proposalAddress',
              component: () => import('@/components/coop/DiscoverProposal.vue'),
            },
          ],
        },
      ],
    },

    // auth
    {
      path: '/auth',
      name: RouteNames.AUTH,
      beforeEnter: [isGuest],
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

    // account
    {
      path: '/member',
      name: RouteNames.ACCOUNT,
      component: () => import('../views/MemberView.vue'),
      beforeEnter: [isMember],
    },
  ],
});

export default router;
