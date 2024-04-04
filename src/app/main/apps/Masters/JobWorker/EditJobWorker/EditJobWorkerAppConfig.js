import React from 'react';

export const EditJobWorkerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/editjobworker',
            component: React.lazy(() => import('./EditJobworker'))
        }
    ]
};
