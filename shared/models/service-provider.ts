import {UserProfile} from "@sts/models/user-profile";
import {Subscription} from "@sts/models/subscription.model";

export interface ServiceProvider {
    id: string;
    email: string;
    phone: string;
    companyName: string;
    taxNumber: string;
    address: string;
    createdBy: UserProfile;
    createdAt: Date;
    updatedAt: Date;
    firstContactDate: Date;
    subscription: Subscription;
}