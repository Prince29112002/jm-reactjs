import React from 'react';

export const DeletedSalesmanAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/deletedsalesman",
            component: React.lazy(() => import('./DeletedSalesman'))
        }
    ]
};


