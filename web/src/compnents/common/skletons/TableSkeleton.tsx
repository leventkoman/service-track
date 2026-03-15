import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Skeleton,
} from '@mui/material'

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="skeleton table">
                <TableHead>
                    <TableRow>
                        {Array.from({ length: columns }).map((_, index) => (
                            <TableCell key={index}>
                                <Skeleton variant="text" width="80%" />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <TableCell key={colIndex}>
                                    <Skeleton variant="text" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}