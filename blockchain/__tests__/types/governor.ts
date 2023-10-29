/**
 * There are 2 standard keys: support and quorum . support=bravo refers to the
 * vote options 0 = Against, 1 = For, 2 = Abstain, as in GovernorBravo .
 * quorum=bravo means that only For votes are counted towards quorum.
 * quorum=for,abstain means that both For and Abstain votes are counted towards quorum.
 */
export enum VoteKeys {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}
