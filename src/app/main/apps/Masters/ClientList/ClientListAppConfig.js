import React from 'react';

export const ClientListAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/clients',
            component: React.lazy(() => import('./ClientList'))
        }
    ]
};
