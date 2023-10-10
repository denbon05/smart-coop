import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          name: 'new-proposal',
          path: 'new-proposal',
          component: () => import('@/components/home/NewProposal.vue'),
        },
        {
          name: 'proposals',
          path: 'proposals',
          component: () => import('@/components/home/ProposalList.vue'),
        },
        {
          name: 'coop-discover',
          path: 'discover',
          component: () => import('@/components/home/DiscoverCoop.vue'),
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
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
  ],
});

export default router;
