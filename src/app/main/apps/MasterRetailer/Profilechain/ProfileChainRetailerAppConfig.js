import React from 'react';
export const ProfileChainRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/profilechainretailer',
            component: React.lazy(() => import('./ProfileChainRetailer'))
        }
    ]
};
