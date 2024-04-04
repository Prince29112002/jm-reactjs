import React from 'react';
export const SalesReturnJobworkAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salesreturnjobwork',
            component: React.lazy(() => import('./SalesReturnJobwork'))
        }
    ]
};
