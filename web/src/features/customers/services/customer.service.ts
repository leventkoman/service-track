import api from "@stf/lib/axios";
import {type AxiosResponse} from "axios";
import {type Customer} from "@sts/models/customer-response";

export const CustomerService = {
    getCustomers: (): Promise<AxiosResponse<Customer[]>> => api.get('/customers')
}