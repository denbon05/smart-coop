import { fetchMember } from '@/api/server';
import Guest from '@/entities/Guest';
import Member from '@/entities/Member';
import type { IAuth } from '@/types/composables/auth';
import { ChainHexIds } from '@/types/ethereum';
import { isArray } from 'lodash';
import { computed, reactive, watch } from 'vue';

export const refetchMemberData = async (
  selectedAddress = auth.selectedAddress
) => {
  if (selectedAddress) {
    auth.isLoading = true;
    // try to fetch user data
    return fetchMember(selectedAddress)
      .then((memberData) => {
        if (memberData) {
          // existed member
          auth.user = new Member(memberData);
        } else {
          auth.user = new Guest();
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        auth.isLoading = false;
      });
  }
};

// global state
const eth = computed(() => window.ethereum);
const auth: IAuth = reactive({
  user: new Guest(),
  selectedAddress: null,
  /** keep track on account data loading or not */
  isLoading: false,
});

watch(
  () => auth.selectedAddress,
  async (newSelectedAddress, oldSelectedAddress) => {
    if (newSelectedAddress) {
      await refetchMemberData(newSelectedAddress);
      if (newSelectedAddress !== oldSelectedAddress && oldSelectedAddress) {
        location.reload();
      }
    }
  }
);

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

// subscribe to Metamask events
window.ethereum?.on('chainChanged', (chainHexId: any) => {
  if (chainHexId !== ChainHexIds.GOERLI || chainHexId !== ChainHexIds.HARDHAT) {
    console.error(`Unsupported chain id ${chainHexId}`);
    return;
  }

  // log out user
  auth.user = new Guest();
});

window.ethereum?.on('accountsChanged', async (addresses) => {
  console.log('accountsChanged', addresses);
  if (isArray(addresses)) {
    const [newSelectedAddress] = addresses;
    auth.selectedAddress = newSelectedAddress;
  }
});
