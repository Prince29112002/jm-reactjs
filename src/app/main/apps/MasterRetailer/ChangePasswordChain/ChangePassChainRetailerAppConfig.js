import React from 'react';
export const ChangePassChainRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/changepasswordchain',
            component: React.lazy(() => import('./ChangePassChainRetailer'))
        }
    ]
};
