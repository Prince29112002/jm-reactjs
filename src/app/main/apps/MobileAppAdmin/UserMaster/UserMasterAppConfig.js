import React from 'react';

export const UserMasterAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/usermaster",
            component: React.lazy(() => import('./UserMaster'))
        }
    ]
};


