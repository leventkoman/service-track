import {ServiceProviderForRequest} from "@sts/types/service-provider.types";
import {UserProfileForServiceRequest} from "@sts/types/user-profile.types";
import {CustomerTypeForServiceRequest} from "@sts/types/customer.types";
import {ServiceRequestStatus} from "@sts/models/service-request-status";

export interface ServiceRequest {
    id: string;
    serviceNumber: string;
    totalAmount: number;
    problem: string;
    solution: null;
    createdBy: UserProfileForServiceRequest;
    customer: CustomerTypeForServiceRequest;
    employees: UserProfileForServiceRequest[];
    serviceProvider: ServiceProviderForRequest;
    serviceRequestsStatus: ServiceRequestStatus;
    isDeleted: boolean;
    createdAt: Date;
    startedAt: Date;
    completedAt: Date;
    updateAt: Date;
}