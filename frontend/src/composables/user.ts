import { readonly, computed } from 'vue';

const eth = computed(() => window.ethereum);

export const useUser = () => {
  if (!eth.value) {
    return {};
  }

  const { selectedAddress } = readonly(window.ethereum!);

  return {
    selectedAddress,
  };
};
