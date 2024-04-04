import React from 'react';

export const WorkStationAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/workstation',
            component: React.lazy(() => import('./WorkStation'))
        }
    ]
};
