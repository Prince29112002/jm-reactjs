import React from 'react';
export const WeightToleranceAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/weighttolerance',
            component: React.lazy(() => import('./WeightTolerance'))
        }
    ]
};
