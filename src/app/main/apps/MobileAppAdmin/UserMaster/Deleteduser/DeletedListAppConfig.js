import React from 'react';

export const DeletedListAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/deletedlist",
            component: React.lazy(() => import('./DeletedList'))
        }
    ]
};


