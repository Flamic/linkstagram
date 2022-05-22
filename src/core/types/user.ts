import { PhotoAttribute } from './image'

export interface AuthUser {
  login: string
  password: string
}

export interface SignUpUser extends AuthUser {
  username: string
}

export interface Profile {
  description: string | null
  firstName: string | null
  followers: number
  following: number
  jobTitle: string | null
  lastName: string | null
  profilePhotoUrl: string | null
  username: string
}

export interface Account extends Profile {
  email: string
}

export interface EditAccount
  extends Partial<
    Pick<
      Profile,
      'description' | 'firstName' | 'lastName' | 'jobTitle' | 'username'
    >
  > {
  profilePhoto?: PhotoAttribute
}

export type RawEditAccount = Omit<EditAccount, 'profilePhoto'> & {
  photo: File | null
}
