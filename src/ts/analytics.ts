import { AnalyticsContent } from './types';

export const sendAnalyticsHit = (content: AnalyticsContent) => {
    const timestamp = new Date().getTime();
    let url = `/static/img/ana.gif?t=${timestamp}`;

    Object.entries(content).forEach(([key, value]) => {
        url = `${url}&${key}=${encodeURIComponent(value)}`;
    });

    fetch(url);
};
