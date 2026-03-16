import {UserProfile} from "@sts/models/user-profile";

export type UserProfileForServiceRequest = Pick<UserProfile, 'id' | 'email' | 'phone' | 'fullName'>