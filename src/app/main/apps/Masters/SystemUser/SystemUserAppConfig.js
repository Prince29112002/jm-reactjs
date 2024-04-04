import React from 'react';

export const SystemUserAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/systemuser',
            component: React.lazy(() => import('./SystemUser'))
        }
    ]
};
