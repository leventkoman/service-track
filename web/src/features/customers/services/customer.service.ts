import api from "@stf/lib/axios";
import {type AxiosResponse} from "axios";
import {type Customer} from "@sts/models/customer-response";
import {type CreateCustomerValue} from "@sts/schemas/create-customer.schema";

export const CustomerService = {
    getCustomers: (signal?: AbortSignal): Promise<AxiosResponse<Customer[]>> => api.get('/customers', { signal: signal! }),
    getCustomerById: (id: string, signal?: AbortSignal): Promise<AxiosResponse<CreateCustomerValue>> => api.get(`/customers/${id}`, { signal: signal! }),
    createCustomer: (body: CreateCustomerValue, signal?: AbortSignal)  => api.post('/customers', body, { signal: signal! }),
    updateCustomer: (body: CreateCustomerValue, signal?: AbortSignal) => api.put(`/customers/${body.id}`, body, { signal: signal! }),
    deleteCustomer: (id: string, signal?: AbortSignal) => api.delete(`/customers/${id}`, { signal: signal! }),
}