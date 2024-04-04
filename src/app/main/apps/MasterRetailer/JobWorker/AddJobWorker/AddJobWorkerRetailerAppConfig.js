import React from 'react';

export const AddJobWorkerRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/jobworkerretailer/addjobworkerretailer',
            component: React.lazy(() => import('./AddJobWorkerRetailer'))
        }
    ]
};
