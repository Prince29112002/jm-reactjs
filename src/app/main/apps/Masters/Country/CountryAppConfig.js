import React from 'react';

export const CountryAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/Country',
            component: React.lazy(() => import('./Country'))
        }
    ]
};
