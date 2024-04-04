import React from 'react';

export const EditClientAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/editclient',
            component: React.lazy(() => import('./EditClient'))
        }
    ]
};
