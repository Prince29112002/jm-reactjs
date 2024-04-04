import React from 'react';

export const ItemTypeRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/itemtype',
            component: React.lazy(() => import('./ItemTypeRetailer'))
        }
    ]
};
