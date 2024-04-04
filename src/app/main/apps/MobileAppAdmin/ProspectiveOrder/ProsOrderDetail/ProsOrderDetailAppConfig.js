import React from 'react';

export const ProsOrderDetailAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/prosOrderDetail",
            component: React.lazy(() => import('./ProsOrderDetail'))
        }
    ]
};


