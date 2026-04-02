import {type Customer} from "@sts/models/customer-response";

export type CustomerType = 'individual' | 'corporate';
export type CustomerTypeForServiceRequest = Pick<Customer, "id" | "customerType" | "note" | "email" | "phone" | "fullName">

export const customerLabels: Record<CustomerType, string> = {
    individual: "Bireysel",
    corporate: "Kurumsal",
}