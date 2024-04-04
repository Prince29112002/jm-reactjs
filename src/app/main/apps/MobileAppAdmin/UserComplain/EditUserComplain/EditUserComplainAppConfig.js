import React from 'react';

export const EditUserComplainAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/usercomplain/editusercomplain",
            component: React.lazy(() => import('./EditUserComplain'))
        }
    ]
};


