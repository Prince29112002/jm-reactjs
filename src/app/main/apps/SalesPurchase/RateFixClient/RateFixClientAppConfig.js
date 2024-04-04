import React from 'react';
export const RateFixClientAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/ratefixclient',
            component: React.lazy(() => import('./RateFixClient'))
        }
    ]
};
