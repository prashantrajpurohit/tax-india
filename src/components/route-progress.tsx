'use client';
import { useLocation } from "react-router-dom";
import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function RouteProgress() {
    const { pathname } = useLocation();


    useEffect(() => {
        NProgress.configure({ showSpinner: false, trickleSpeed: 100 });
        NProgress.start();
        const bar = document.querySelector('#nprogress .bar') as HTMLElement;
        const themeColor = getComputedStyle(document.body).getPropertyValue('--primary')?.trim();
        if (bar && themeColor) {
            bar.style.setProperty('background-color', themeColor, 'important');
        }
        const timeout = setTimeout(() => {
            NProgress.done();
        }, 300); // Simulate delay to see the loader

        return () => {
            clearTimeout(timeout);
        };
    }, [pathname]);

    return null;
}
