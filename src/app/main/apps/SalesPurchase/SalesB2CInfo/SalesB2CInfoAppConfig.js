import React from 'react';
export const SalesB2CInfoAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/b2csaleinfo',
            component: React.lazy(() => import('./SalesB2CInfo'))
        }
    ]
};
