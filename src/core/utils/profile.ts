import { Profile } from 'core/types/user'

export const getProfileName = (profile: Profile) =>
  (profile.firstName &&
    profile.lastName &&
    `${profile.firstName} ${profile.lastName}`) ||
  profile.firstName ||
  profile.lastName ||
  profile.username
