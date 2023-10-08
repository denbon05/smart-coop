import type { GovernorAccount } from '@/types/entities/account';
import { computed, reactive, readonly, toValue } from 'vue';

// global state
const eth = computed(() => window.ethereum);
const account = reactive<Partial<GovernorAccount>>({});

const setAccount = ({
  accountType,
  email,
  location,
  name,
  exists = false,
}: GovernorAccount) => {
  // the values are Proxy object, can't use Object.assign for reactive behavior
  account.accountType = accountType;
  account.email = email;
  account.exists = exists;
  account.location = location;
  account.name = name;
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
