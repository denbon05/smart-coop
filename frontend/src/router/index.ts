import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import WelcomeView from '../views/WelcomeView.vue';
import NotFound from '../views/NotFound.vue';
import { isMember, isGuest } from './permissions';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // will match everything and put it under `$route.params.pathMatch`
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
      beforeEnter: [isGuest],
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: [isMember],
      children: [
        {
          name: 'new-proposal',
          path: 'new-proposal',
          component: () => import('@/components/coop/NewProposal.vue'),
        },
        {
          name: 'proposals',
          path: 'proposals',
          component: () => import('@/components/coop/ProposalList.vue'),
        },
        // {
        //   name: 'coop-discover',
        //   path: 'discover',
        //   component: () => import('@/components/coop/DiscoverCoop.vue'),
        // },
        {
          name: 'proposal-history',
          path: 'proposal-history',
          component: () => import('@/components/coop/ProposalList.vue'),
        },
      ],
    },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    {
      path: '/member',
      name: 'member',
      component: () => import('../views/MemberView.vue'),
      beforeEnter: [isMember],
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
  ],
});

export default router;
