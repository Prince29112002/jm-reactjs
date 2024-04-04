import React from 'react';

export const HSNMasterAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/HSNMaster',
            component: React.lazy(() => import('./HSNMaster'))
        }
    ]
};
