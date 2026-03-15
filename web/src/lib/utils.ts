import type {CustomerType} from "@sts/types/customer-type";

export function convertCustomerType(customerType: CustomerType): string {
    if (!customerType) {
        return "";
    }
    
    switch (customerType) {
        case "corporate":
            return "Kurumsal";
        case "individual":
            return "Bireysel";
        default:
            return "";
    }
}