import React from 'react';
export const RateMatchAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/ratematch',
            component: React.lazy(() => import('./RateMatch'))
        }
    ]
};
