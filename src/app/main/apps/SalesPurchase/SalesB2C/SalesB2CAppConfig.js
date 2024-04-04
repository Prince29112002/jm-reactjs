import React from 'react';
export const SalesB2CAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salesb2c',
            component: React.lazy(() => import('./SalesB2C'))
        }
    ]
};
