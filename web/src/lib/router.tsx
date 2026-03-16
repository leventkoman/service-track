import {createBrowserRouter, Navigate} from "react-router";
import AuthLayout from "../compnents/layout/AuthLayout.tsx";
import React, { Suspense} from "react";
import {TextSkeleton} from "../compnents/common/skletons/TextSkeleton.tsx";
import MainLayout from "../compnents/layout/MainLayout.tsx";
import {CustomerPage, DashboardPage, LoginPage, ServiceProviderPage, ServiceRequestPage, UserPage} from "../pages";
import TableSkeleton from "../compnents/common/skletons/TableSkeleton";

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
                element: (withSuspense(DashboardPage, <TextSkeleton/>))
            },
            {
                path: '/service-providers',
                element: (withSuspense(ServiceProviderPage, <TableSkeleton/>))
            },
            {
                path: '/customers',
                element: (withSuspense(CustomerPage, <TableSkeleton/>))
            },
            {
                path: '/users',
                element: (withSuspense(UserPage, <TableSkeleton/>))
            },
            {
                path: '/service-requests',
                element: (withSuspense(ServiceRequestPage, <TableSkeleton/>))
            }
        ]
    }
])