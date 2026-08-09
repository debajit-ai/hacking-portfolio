'use client';

import { useEffect, useState } from 'react';

export function useScrollProgress(): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function handleScroll() {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll <= 0) {
                setProgress(0);
                return;
            }
            const currentScroll = window.scrollY;
            const p = Math.min(Math.max(currentScroll / totalScroll, 0), 1);
            setProgress(p);
        }

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    return progress;
}
