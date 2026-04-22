import {createBrowserRouter, Navigate} from "react-router";
import AuthLayout from "../compnents/layout/AuthLayout.tsx";
import React, { Suspense} from "react";
import {TextSkeleton} from "../compnents/common/skletons/TextSkeleton.tsx";
import MainLayout from "../compnents/layout/MainLayout.tsx";
import {
    CreateCustomerPage, CreateServiceRequestPage,
    CreateUserPage,
    CustomerPage,
    DashboardPage,
    LoginPage,
    ServiceProviderPage,
    ServiceRequestPage, SubscriptionsPage,
    UserPage
} from "../pages";
import TableSkeleton from "../compnents/common/skletons/TableSkeleton";
import FormSkeleton from "../compnents/common/skletons/FormSkeleton";
import {permissionLoader} from "@stf/lib/loaders/permission.loader";

const withSuspense = (Component: React.LazyExoticComponent<any>, fallback?: React.ReactNode) => (
    <Suspense fallback={fallback}> 
        <Component/>
    </Suspense>
)

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to='/auth/login' replace/>
    },
    {
        path: '/auth',
        element: <AuthLayout/>,
        children: [
            {
                index: true,
                element: <Navigate to='/auth/login' replace/>
            },
            {
                path: 'login',
                element: (withSuspense(LoginPage))
            }   
        ]
    },
    {
        element: <MainLayout/>,
        children: [
            {
                path: '/dashboard',
                loader: permissionLoader(['super_admin', 'admin', 'employee']),
                element: (withSuspense(DashboardPage, <TextSkeleton/>))
            },
            {
                path: '/service-providers',
                loader: permissionLoader(['super_admin', 'admin', 'employee']),
                element: (withSuspense(ServiceProviderPage, <TableSkeleton/>))
            },
            {
                path: '/customers',
                loader: permissionLoader(['super_admin', 'admin', 'employee']),
                element: (withSuspense(CustomerPage, <TableSkeleton/>)),
            },
            {
                path: '/customers/create',
                loader: permissionLoader(['admin', 'employee']),
                element: (withSuspense(CreateCustomerPage, <FormSkeleton/>))
            },
            {
                path: '/customers/:customerId/edit',
                loader: permissionLoader(['admin', 'employee']),
                element: (withSuspense(CreateCustomerPage))
            },
            {
                path: '/users',
                loader: permissionLoader(['super_admin', 'admin', 'employee']),
                element: (withSuspense(UserPage, <TableSkeleton/>))
            },
            {
                path: '/users/create',
                loader: permissionLoader(['super_admin', 'admin']),
                element: (withSuspense(CreateUserPage, <FormSkeleton/>))
            },
            {
                path: '/users/:userId/edit',
                loader: permissionLoader(['super_admin', 'admin', 'employee']),
                element: (withSuspense(CreateUserPage))
            },
            {
                path: '/service-requests',
                loader: permissionLoader(['super_admin', 'admin', 'employee']),
                element: (withSuspense(ServiceRequestPage, <TableSkeleton/>))
            },
            {
                path: '/service-requests/create',
                loader: permissionLoader(['admin', 'employee']),
                element: (withSuspense(CreateServiceRequestPage, <FormSkeleton/>))
            },
            {
                path: '/service-requests/:serviceRequestId/edit',
                loader: permissionLoader(['admin', 'employee']),
                element: (withSuspense(CreateServiceRequestPage))
            },
            {
                path: '/subscriptions',
                loader: permissionLoader(['super_admin']),
                element: (withSuspense(SubscriptionsPage, <TableSkeleton/>))
            },
        ]
    }
])