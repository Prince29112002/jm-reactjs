import React from 'react';

export const JobWorkerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/jobworker',
            component: React.lazy(() => import('./JobWorker'))
        }
    ]
};
