export interface Stat {
    users: {
        total: number;
        active: number;
        passive: number;
    };
    customerCount: number;
    revenueTotal: number;
    serviceProviderCount: number | null;
    subscriptionCount: {
        total: number;
        active: number;
    }
    serviceRequests: {
        name: string;
        nameLocalized: string;
        count: number;
    }[] | null;
}