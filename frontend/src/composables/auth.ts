import { fetchMember } from '@/api/server';
import Guest from '@/entities/Guest';
import Member from '@/entities/Member';
import type { IAuth } from '@/types/composables/auth';
import { computed, reactive, watch, watchEffect } from 'vue';

// global state
const eth = computed(() => window.ethereum);
const auth: IAuth = reactive({
  user: new Guest(),
  selectedAddress: null,
  /** keep track on account data loading or not */
  isLoading: false,
});

watchEffect(async () => {
  if (window.ethereum?.selectedAddress) {
    auth.isLoading = true;
    // try to fetch user data
    await fetchMember(window.ethereum.selectedAddress)
      .then((memberData) => {
        if (memberData) {
          // existed member
          auth.user = new Member(memberData);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        auth.isLoading = false;
      });
  }
});

export const useAuth = (): IAuth => {
  if (!eth.value) {
    // there is no injected ethereum in the browser
    console.error('there is no injected ethereum in the browser');
    return auth;
  }

  const { selectedAddress } = eth.value;
  auth.selectedAddress = selectedAddress ?? '';

  return auth;
};
