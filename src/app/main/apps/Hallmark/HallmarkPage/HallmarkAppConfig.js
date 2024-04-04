import React from 'react';

export const HallmarkAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/hallmark',
            component: React.lazy(() => import('./Hallmark'))

        }
    ]
};
