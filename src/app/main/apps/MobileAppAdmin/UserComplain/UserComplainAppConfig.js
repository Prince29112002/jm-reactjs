import React from 'react';

export const userComplainAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/usercomplain",
            component: React.lazy(() => import('./UserComplain'))
        }
    ]
};


