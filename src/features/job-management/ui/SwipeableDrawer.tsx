import * as React from 'react';
import {
    Box,
    SwipeableDrawer as MuiSwipeableDrawer,
    List,
    Divider,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface Item {
    text: string;
    icon?: React.ReactNode;
}

interface Section {
    items: Item[];
}

interface SwipeableDrawerProps {
    anchor?: Anchor;
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
    sections: Section[];
}

export default function SwipeableDrawer({
    anchor = 'left',
    open,
    onClose,
    onOpen,
    sections,
}: SwipeableDrawerProps) {
    const handleClose = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        onClose();
    };

    const list = () => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={handleClose}
            onKeyDown={handleClose}
        >
            {sections.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                    <List>
                        {section.items.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton>
                                    {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    {sectionIndex < sections.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </Box>
    );

    return (
        <MuiSwipeableDrawer
            anchor={anchor}
            open={open}
            onClose={onClose}
            onOpen={onOpen}
        >
            {list()}
        </MuiSwipeableDrawer>
    );
}