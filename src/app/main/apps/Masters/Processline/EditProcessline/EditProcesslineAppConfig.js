import React from 'react';

export const EditProcesslineAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/processline/editprocessline',
            component: React.lazy(() => import('./EditProcessline'))
        }
    ]
};
