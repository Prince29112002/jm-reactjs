import React from 'react';

export const PlanningLotsAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/Planning/planninglots',
            component: React.lazy(() => import('./PlanningLots'))
        }
    ]
};
