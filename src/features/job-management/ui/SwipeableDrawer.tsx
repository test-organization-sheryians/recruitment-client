import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface DrawerItem {
  label: string;
  icon?: React.ReactNode;
}

interface ReusableDrawerProps {
  anchor?: Anchor;
  buttonLabel?: string;
  width?: number;
  items: DrawerItem[];
  extraItems?: DrawerItem[];
}

const ReusableDrawer: React.FC<ReusableDrawerProps> = ({
  anchor = 'left',
  buttonLabel = 'Open Drawer',
  width = 250,
  items,
  extraItems = [],
}) => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer =
    (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setOpen(open);
    };

  return (
    <>
      <Button onClick={toggleDrawer(true)}>{buttonLabel}</Button>

      <SwipeableDrawer
        anchor={anchor}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : width }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {items.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {extraItems.length > 0 && (
            <>
              <Divider />
              <List>
                {extraItems.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton>
                      {item.icon && (
                        <ListItemIcon>{item.icon}</ListItemIcon>
                      )}
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default SwipeableDrawer;
