export interface AuthUser {
  login: string
  password: string
}

export interface SignUpUser extends AuthUser {
  username: string
}

export interface UserProfile {
  description: string
  firstName: string
  followers: number
  following: number
  jobTitle: string
  lastName: string
  profilePhotoUrl: string
  username: string
}
