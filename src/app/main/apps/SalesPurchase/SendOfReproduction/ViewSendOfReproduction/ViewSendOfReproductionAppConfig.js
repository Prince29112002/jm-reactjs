import React from 'react';
export const ViewSendOfReproductionAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/sendofreproduction/viewsendofreproduction',
            component: React.lazy(() => import('./ViewSendOfReproduction'))
        }
    ]
};
