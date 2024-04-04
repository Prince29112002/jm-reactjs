import React from 'react';

export const ProductionMainAppConfig = {
    settings: {
        layout: {
            config: {
               
            }
        }
    },
    routes: [
        {
            path: "/dashboard/production",
            // component: MainDesignPage
            component: React.lazy(() => import('./ProductionMain'))

        }
    ]
};


