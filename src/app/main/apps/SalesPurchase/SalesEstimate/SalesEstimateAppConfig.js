import React from 'react';
export const SalesEstimateAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/createestimate',
            component: React.lazy(() => import('./SalesEstimate'))
        }
    ]
};
