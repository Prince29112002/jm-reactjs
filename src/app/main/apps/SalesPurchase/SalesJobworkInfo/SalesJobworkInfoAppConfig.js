import React from 'react';
export const SalesJobworkInfoAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salejobworkinfo',
            component: React.lazy(() => import('./SalesJobworkInfo'))
        }
    ]
};
