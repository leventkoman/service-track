import React from "react";

export interface ActionMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick: (row: any) => void;
    color?: string;
    hidden?: boolean;
}