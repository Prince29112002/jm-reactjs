import React from 'react';

export const TagSystemRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/tagsystemretailer',
            component: React.lazy(() => import('./TagSystemRetailer'))
        }
    ]
};
