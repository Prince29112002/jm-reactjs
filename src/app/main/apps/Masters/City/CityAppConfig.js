import React from 'react';

export const CityAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/City',
            component: React.lazy(() => import('./City'))
        }
    ]
};
