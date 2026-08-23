import { userRepository } from '@/lib/backend';

/** Thin feature API over the provider-neutral UserRepository. */
export const userCounterApi = {
  /** Counts in the store, not in the client — see BaseRepository.count(). */
  count: () => userRepository.count(),
};
