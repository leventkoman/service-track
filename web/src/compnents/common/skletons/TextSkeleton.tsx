import {Skeleton} from "@mui/material";

export function TextSkeleton() {
    const isEven = (index: number) => {
        return index % 2 === 0;
    }
    return (
        <div>
            {Array.from(new Array(7)).map((_, index) => (
                <Skeleton width={isEven(index) ? "100%" : "60%"} variant="text" sx={{ fontSize: '1rem' }} key={index}/>
            ))}
        </div>
    )
}