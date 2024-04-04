import React from 'react';

export const EditJobWorkerRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/editjobworkerretailer',
            component: React.lazy(() => import('./EditJobworkerRetailer'))
        }
    ]
};
