import React from 'react';

export const NewsAndUpdateAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/newsupdate",
            component: React.lazy(() => import('./NewsAndUpdate'))
        }
    ]
};


