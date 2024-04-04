import React from 'react';

export const ItemTypeAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/itemtype',
            component: React.lazy(() => import('./ItemType'))
        }
    ]
};
