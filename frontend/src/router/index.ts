import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    {
      path: '/coop',
      name: 'coop',
      component: () => import('../views/CoopView.vue'),
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
      ],
    },
    {
      path: '/member',
      name: 'member',
      component: () => import('../views/MemberView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
  ],
});

export default router;
