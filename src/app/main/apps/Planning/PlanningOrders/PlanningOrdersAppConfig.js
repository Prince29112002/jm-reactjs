import React from 'react';

export const PlanningOrdersAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/Planning/planningorders',
            component: React.lazy(() => import('./PlanningOrders'))
        }
    ]
};
