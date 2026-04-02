import { Box, Skeleton } from '@mui/material';

interface FormSkeletonProps {
    rows?: number;
}

export default function FormSkeleton({ rows = 5 }: FormSkeletonProps) {
    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Skeleton variant="text" width={200} height={40} />
            
            {Array.from({ length: rows }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={36} />
            ))}
            
            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Skeleton variant="rounded" width={100} height={36} />
                <Skeleton variant="rounded" width={100} height={36} />
            </Box>
        </Box>
    );
}