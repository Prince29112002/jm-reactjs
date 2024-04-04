import React from 'react';

export const AddExhibitionAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/addexhibition",
            component: React.lazy(() => import('./AddExhibition'))
        }
    ]
};


