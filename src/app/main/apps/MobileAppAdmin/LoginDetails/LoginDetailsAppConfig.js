import React from 'react';

export const LoginDetailsAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/logindetails",
            component: React.lazy(() => import('./LoginDetails'))
        }
    ]
};


