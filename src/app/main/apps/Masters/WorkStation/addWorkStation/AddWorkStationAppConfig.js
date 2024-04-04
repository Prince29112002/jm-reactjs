import React from 'react';

export const AddWorkStationAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/addworkstation',
            component: React.lazy(() => import('./AddWorkStation'))
        }
    ]
};
