import React, {useState} from "react";
import {IconButton, Menu, MenuItem} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {type ActionMenuItem} from "@stf/models/ActionMenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

interface ActionMenuProps<T> {
    row: T;
    items: ActionMenuItem[];
};

export default function ActionMenu({ row, items }: ActionMenuProps<any>) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const visibleItems = items.filter(item => !item.hidden);

    return (
        <>
            <IconButton onClick={handleOpen} size="small">
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {visibleItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => { item.onClick(row); handleClose(); }}
                        sx={{ color: item.color }}
                    >
                        {item.icon && <ListItemIcon sx={{ color: item.color }}>{item.icon}</ListItemIcon>}
                        <ListItemText>{item.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}