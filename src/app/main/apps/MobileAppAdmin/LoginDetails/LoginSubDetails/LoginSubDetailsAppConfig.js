import React from 'react';

export const LoginSubDetailsAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/loginsubdetails",
            component: React.lazy(() => import('./LoginSubDetails'))
        }
    ]
};



