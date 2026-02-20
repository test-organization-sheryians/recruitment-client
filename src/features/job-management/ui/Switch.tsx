import * as React from 'react';
import Switch from '@mui/material/Switch';

interface ControlledSwitchProps extends Omit<React.ComponentProps<typeof Switch>, 'checked' | 'onChange'> {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    ariaLabel?: string;
}

export default function ControlledSwitch({
    checked,
    onChange,
    ariaLabel = 'controlled',
    ...props
}: ControlledSwitchProps) {
    return (
        <Switch
            checked={checked}
            onChange={onChange}
            slotProps={{ input: { 'aria-label': ariaLabel } }}
            {...props}
        />
    );
}