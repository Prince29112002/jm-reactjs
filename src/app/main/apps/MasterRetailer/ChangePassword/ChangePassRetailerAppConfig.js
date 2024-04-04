import React from 'react';
export const ChangePassRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/changepassword',
            component: React.lazy(() => import('./ChangePassRetailer'))
        }
    ]
};
