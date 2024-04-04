import React from 'react';

export const MakingChargesRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/makingchargesretailer',
            component: React.lazy(() => import('./MakingChargesRetailer'))
        }
    ]
};
