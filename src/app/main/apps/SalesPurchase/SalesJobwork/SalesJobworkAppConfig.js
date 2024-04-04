import React from 'react';
export const SalesJobworkAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salejobwork',
            component: React.lazy(() => import('./SalesJobwork'))
        }
    ]
};
