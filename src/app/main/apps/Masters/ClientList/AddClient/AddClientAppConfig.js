import React from 'react';

export const AddClientAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/addclient',
            component: React.lazy(() => import('./AddClient'))
        }
    ]
};
