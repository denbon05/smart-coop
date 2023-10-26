export const makeProposeDescription = (title: string, description: string) =>
  `${title}\n${description}`;

export const parseProposalDescription = (proposalDescription: string) => {
  const [title, ...rest] = proposalDescription.split('\n');
  return {
    title,
    description: rest.join('\n'),
  };
};

/** IGovernor human readable proposal state */
export const proposalStateByEnumValue = {
  '0': 'Pending',
  '1': 'Active',
  '2': 'Canceled',
  '3': 'Defeated',
  '4': 'Succeeded',
  '5': 'Queued',
  '6': 'Expired',
  '7': 'Executed',
};
