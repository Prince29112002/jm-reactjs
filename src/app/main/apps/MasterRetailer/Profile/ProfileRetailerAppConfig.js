import React from 'react';
export const ProfileRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/profileretailer',
            component: React.lazy(() => import('./ProfileRetailer'))
        }
    ]
};
