import React from 'react';

export const HallmarkStationAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/hallmarkstation',
            component: React.lazy(() => import('./HallmarkStation'))
        }
    ]
};
