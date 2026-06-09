import { userRepository } from '@/lib/backend';

/** Thin feature API over the provider-neutral UserRepository. */
export const membersApi = {
  list: () => userRepository.findAll(),
  /** Demo helper: creates a placeholder member. */
  addDemo: () =>
    userRepository.create({
      email: `member${Date.now()}@example.com`,
      name: 'New Member',
      avatarUrl: null,
      role: 'user',
    }),
};
