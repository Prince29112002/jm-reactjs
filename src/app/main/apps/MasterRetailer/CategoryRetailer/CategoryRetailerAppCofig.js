import React from 'react';

export const CategoryRetailerAppCofig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/categoryretailer',
            component: React.lazy(() => import('./CategoryRetailer'))
        }
    ]
};
