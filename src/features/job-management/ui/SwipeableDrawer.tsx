'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import MuiSwipeableDrawer from '@mui/material/SwipeableDrawer';

export type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface SwipeableDrawerProps {
  anchor?: Anchor;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

const SwipeableDrawer: React.FC<SwipeableDrawerProps> = ({
  anchor = 'right', 
  open,
  onOpen,
  onClose,
  children,
}) => {
  return (
    <MuiSwipeableDrawer
      anchor={anchor}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
    >
      <Box
        sx={{
        
          width: { xs: '100vw', md: '60vw' }, // minimum ~65–70%
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </MuiSwipeableDrawer>
  );
};

export default SwipeableDrawer;
