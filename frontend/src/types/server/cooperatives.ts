import type { Coop, Member } from '../backend-api/edge';

export type FetchedCoop = Coop & { members: Member[] };
