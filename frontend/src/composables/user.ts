import { readonly, ref } from 'vue';

export const useUser = () => {
  const eth = ref(window.ethereum);

  if (!eth.value) {
    return {};
  }

  const { selectedAddress } = readonly(window.ethereum!);

  return {
    selectedAddress,
  };
};
