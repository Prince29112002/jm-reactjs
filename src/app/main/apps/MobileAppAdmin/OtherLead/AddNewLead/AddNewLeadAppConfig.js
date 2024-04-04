import React from 'react';

export const AddNewLeadAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/addnewlead",
            component: React.lazy(() => import('./AddNewLead'))
        }
    ]
};


