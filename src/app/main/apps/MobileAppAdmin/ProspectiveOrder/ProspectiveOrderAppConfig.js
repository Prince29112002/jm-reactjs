import React from 'react';

export const ProspectiveOrderAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/prospectiveorders",
            component: React.lazy(() => import('./ProspectiveOrder'))
        }
    ]
};


