declare namespace Express {
    interface Request {
        user?: {
            userId: string;
            email: string;
            phone: string;
            roles: string[];
            serviceProviderId: string | null;
        }
    }
}