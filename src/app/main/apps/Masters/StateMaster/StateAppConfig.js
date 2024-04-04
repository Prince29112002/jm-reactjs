import React from 'react';
export const StateAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/state',
            component: React.lazy(() => import('./StateMaster'))
        }
    ]
};
