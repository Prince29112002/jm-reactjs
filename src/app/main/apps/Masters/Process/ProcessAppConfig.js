import React from 'react';

export const ProcessAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/process',
            component: React.lazy(() => import('./Process'))
        }
    ]
};
