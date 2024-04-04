import React from 'react';

export const EditWorkStationAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/editworkstation',
            component: React.lazy(() => import('./EditWorkStation'))
        }
    ]
};
