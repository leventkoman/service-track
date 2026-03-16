import {lazy} from "react";

export const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
export const CustomerPage = lazy(() => import('../pages/customers/CustomerPage'));
export const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
export const ServiceProviderPage = lazy(() => import('./service-provider/ServiceProvider'));
export const ServiceRequestPage = lazy(() => import('./service-requests/ServiceRequestPage'));
export const UserPage = lazy(() => import('./users/UserPage'));