import { userRepository } from '@/lib/backend';

/** Thin feature API over the provider-neutral UserRepository. */
export const userCounterApi = {
  count: () => userRepository.findAll().then((users) => users.length),
};
