import React from 'react';

export const GoldRateAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/goldrate',
            component: React.lazy(() => import('./GoldRate'))
        }
    ]
};
