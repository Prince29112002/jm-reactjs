import React from 'react';

export const AddUserAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/adduser",
            component: React.lazy(() => import('./AddUser'))
        }
    ]
};


