import React from 'react';

export const BaggingAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/bagging',
            component: React.lazy(() => import('./Bagging'))
        }
    ]
};
