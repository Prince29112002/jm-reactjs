import React from 'react';

export const AddNewsUpdatesAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/addnewsupdate",
            component: React.lazy(() => import('./AddNewsUpdates'))
        }
    ]
};


