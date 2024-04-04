import React from 'react';

export const AddProcesslineAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/processline/addprocessline',
            component: React.lazy(() => import('./AddProcessline'))
        }
    ]
};
