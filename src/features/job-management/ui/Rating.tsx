import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

interface HoverRatingProps extends Omit<React.ComponentProps<typeof Rating>, 'onChangeActive'> {
    onChangeActive?: (event: React.SyntheticEvent<Element, Event>, newHover: number) => void;
    labels?: { [key: number]: string };
}

const defaultLabels: { [index: string]: string } = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function getLabelText(value: number, labels: { [key: number]: string }) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function HoverRating({
    value,
    onChange,
    onChangeActive,
    labels = defaultLabels,
    precision = 0.5,
    max = 5,
    size = 'medium',
    readOnly = false,
    disabled = false,
    ...props
}: HoverRatingProps) {
    const [hover, setHover] = React.useState(-1);

    const handleChangeActive = (event: React.SyntheticEvent<Element, Event>, newHover: number) => {
        setHover(newHover);
        if (onChangeActive) {
            onChangeActive(event, newHover);
        }
    };

    return (
        <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
            <Rating
                name="hover-feedback"
                value={value}
                precision={precision}
                max={max}
                size={size}
                readOnly={readOnly}
                disabled={disabled}
                getLabelText={(val) => getLabelText(val, labels)}
                onChange={onChange}
                onChangeActive={handleChangeActive}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                {...props}
            />
            {value !== null && (
                <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value!]}</Box>
            )}
        </Box>
    );
}