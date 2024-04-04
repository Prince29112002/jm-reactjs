import React from 'react';

export const JobWorkerRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/jobworkerretailer',
            component: React.lazy(() => import('./JobWorkerRetailer'))
        }
    ]
};
