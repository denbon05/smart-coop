import { computed, readonly, toValue } from 'vue';

interface UserStored {
  isLogged?: boolean;
}

// global state
const eth = computed(() => window.ethereum);
const user = computed<UserStored>({
  get() {
    return JSON.parse(localStorage.getItem('user') ?? '{}');
  },
  set(user: UserStored) {
    return localStorage.setItem('user', JSON.stringify(user));
  },
});

const setUser = (userData: UserStored) => {
  user.value = userData;
};

export const useAuth = () => {
  if (!eth.value) {
    // default values
    return {
      user: {
        isLogged: false,
      } as UserStored,
    };
  }

  const { selectedAddress } = readonly(window.ethereum!);

  return {
    selectedAddress,
    user: toValue(user),
    setUser,
  };
};
