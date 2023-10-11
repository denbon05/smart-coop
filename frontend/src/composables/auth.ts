import type { GovernorAccount } from '@/types/entities/account';
import { computed, reactive, readonly, toValue } from 'vue';

// global state
const eth = computed(() => window.ethereum);
const account = reactive<Partial<GovernorAccount>>({});

const setAccount = ({ isMember: exists = false }: GovernorAccount) => {
  account.isMember = exists;
};

export const useAuth = () => {
  if (!eth.value) {
    // no ethereum in window
    return {
      setAccount,
    };
  }

  const { selectedAddress } = readonly(window.ethereum!);

  return {
    selectedAddress,
    account: toValue(account),
    setAccount,
  };
};
