import React from 'react';

export const ProcesslineAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/processline',
            component: React.lazy(() => import('./Processline'))
        }
    ]
};

