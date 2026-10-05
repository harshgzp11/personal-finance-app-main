import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AnimatedNumber smoothly interpolates between old and new values.
 */
export const AnimatedNumber = ({ value, duration = 800, formatFn = (n) => n.toLocaleString('en-IN') }) => {
    const [displayVal, setDisplayVal] = useState(value);

    useEffect(() => {
        const startVal = displayVal;
        const endVal = Number(value) || 0;
        if (startVal === endVal) return;

        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic formula
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentNumber = startVal + (endVal - startVal) * easeOutProgress;

            setDisplayVal(Math.round(currentNumber));

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        const animFrame = requestAnimationFrame(updateCounter);
        return () => cancelAnimationFrame(animFrame);
    }, [value, duration]);

    return <span>{formatFn(displayVal)}</span>;
};

AnimatedNumber.propTypes = {
    value: PropTypes.number.isRequired,
    duration: PropTypes.number,
    formatFn: PropTypes.func
};

export default AnimatedNumber;
