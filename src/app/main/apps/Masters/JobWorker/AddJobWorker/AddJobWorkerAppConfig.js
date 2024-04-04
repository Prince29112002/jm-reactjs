import React from 'react';

export const AddJobWorkerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/addjobworker',
            component: React.lazy(() => import('./AddJobWorker'))
        }
    ]
};
