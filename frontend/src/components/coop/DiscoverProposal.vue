<script setup lang="ts">
import {
  castVote,
  executeProposal,
  fetchProposalDetails,
} from '@/api/governor/eth-governor';
import { useAuth } from '@/composables/auth';
import { useProposal } from '@/composables/proposal';
import { SnackbarColor, type ShowSnackbar } from '@/types/components/common';
import { RouteNames } from '@/types/entities/router';
import type { HumanProposalState, ProposalDetails } from '@/types/governor';
import { VoteKeys } from '@/types/governor';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { inject, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);
const { proposal } = useProposal();
const router = useRouter();
const auth = useAuth();

// init default values
const proposalDetails = reactive<ProposalDetails>({ hasAddressVoted: true });
const isDetailsLoading = ref(true);

console.log('proposal', proposal);

onBeforeMount(async () => {
  isDetailsLoading.value = true;
  try {
    const details = await fetchProposalDetails(auth.user.coopId, proposal.id);
    Object.assign(proposalDetails, details);
  } catch (err) {
    console.error(err);
    showSnackbar({ msg: 'Failed to load proposal details' });
  }
  isDetailsLoading.value = false;
});

onMounted(() => {
  if (!proposal.id) {
    // TODO fetch data of the page independently
    // ? data forwarded from `proposals` page
    return router.push({
      name: RouteNames.PROPOSALS,
    });
  }

  const proposalChartEl = document.getElementById(
    'proposalChart'
  ) as HTMLCanvasElement;

  if (proposalChartEl) {
    // mount the chart in the DOM
    const votes = [
      proposal.forVotes,
      proposal.againstVotes,
      proposal.abstainVotes,
    ];
    new Chart(proposalChartEl, {
      type: 'pie',
      data: {
        labels: ['Yes', 'No', 'Abstain'],
        datasets: [
          {
            data: votes,
            backgroundColor: ['#1D9300', '#FBC400', '#FB7800'],
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          datalabels: {
            font: {
              weight: 800,
              size: 17,
            },
          },
          tooltip: { enabled: false },
        },
        layout: { padding: { top: 30, bottom: 20 } },
      },
      plugins: [ChartDataLabels],
    });
  }
});

const humanProposalState: HumanProposalState =
  proposal.state as HumanProposalState;

const isLoading = ref(false);

const handleCastVote = async (voteKey: VoteKeys) => {
  isLoading.value = true;
  try {
    await castVote({
      governorAddress: auth.user.coopId,
      proposalId: proposal.id,
      voteKey,
    });
    showSnackbar({ msg: 'Vote casted successfully', color: SnackbarColor.OK });
    router.push({
      name: RouteNames.PROPOSALS,
    });
  } catch (err) {
    console.error(err);
    showSnackbar({ msg: 'Failed to cast the vote' });
  }
  isLoading.value = false;
};

const execute = async () => {
  isLoading.value = true;
  try {
    await executeProposal(auth.user.coopId, proposal);
    showSnackbar({ msg: 'Execution is queued', color: SnackbarColor.OK });
    router.push({
      name: RouteNames.PROPOSAL_HISTORY,
    });
  } catch (err) {
    console.error(err);
    showSnackbar({ msg: 'Failed to execute' });
  }
  isLoading.value = false;
};
</script>

<template>
  <v-row justify="center" id="discoverProposal" class="d-flex">
    <v-col md="5" id="proposalAbout" class="d-flex flex-column">
      <h4 class="text-h4 my-4">
        {{ proposal.title }} <v-chip> {{ humanProposalState }} </v-chip>
      </h4>

      <dl class="my-2">
        <dt class="text-orange font-weight-bold">Creator</dt>
        <dd>{{ proposal.proposerAddress }}</dd>
      </dl>
      <dl class="my-2">
        <dt class="text-orange font-weight-bold">Proposal</dt>
        <dd>{{ proposal.description }}</dd>
      </dl>
      <dl class="my-2">
        <dt class="text-orange font-weight-bold">Cost</dt>
        <dd>{{ proposal.cost }} ETH</dd>
      </dl>
    </v-col>

    <v-col cols="1"></v-col>

    <v-col md="4" id="proposalDashboard" class="d-flex flex-column px-10">
      <canvas id="proposalChart"></canvas>

      <template v-if="!isDetailsLoading">
        <template v-if="humanProposalState === 'Active'">
          <section
            v-if="!proposalDetails.hasAddressVoted"
            class="d-flex flex-column mt-5"
          >
            <h6 class="text-h6 text-center">Your vote</h6>
            <section id="dashActions" class="d-flex justify-center">
              <v-btn
                :disabled="isDetailsLoading || isLoading"
                class="ma-3 btn-long"
                color="green"
                @click="handleCastVote(VoteKeys.FOR)"
                >yes</v-btn
              >
              <v-btn
                :disabled="isDetailsLoading || isLoading"
                class="ma-3 btn-long"
                color="#FBC400"
                @click="handleCastVote(VoteKeys.AGAINST)"
                >no</v-btn
              >
            </section>
          </section>

          <h4 v-else-if="proposalDetails.hasAddressVoted" class="text-center">
            You have already voted
          </h4>
        </template>

        <h4
          v-else-if="proposal.state === 'Succeeded'"
          class="d-flex justify-center"
        >
          <v-btn
            :disabled="isLoading"
            @click="execute"
            class="btn-long btn-sunset text-white"
            >execute</v-btn
          >
        </h4>

        <h4 v-else class="text-center text-h4">{{ humanProposalState }}</h4>
      </template>
    </v-col>
  </v-row>
</template>
