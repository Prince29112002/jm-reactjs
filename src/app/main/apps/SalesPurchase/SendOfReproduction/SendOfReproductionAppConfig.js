import React from 'react';
export const SendOfReproductionAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/sendofreproduction',
            component: React.lazy(() => import('./SendOfReproduction'))
        }
    ]
};
