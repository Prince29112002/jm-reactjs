import React from 'react';
export const SalesConsumableAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salesconsumable',
            component: React.lazy(() => import('./SalesConsumable'))
        }
    ]
};
