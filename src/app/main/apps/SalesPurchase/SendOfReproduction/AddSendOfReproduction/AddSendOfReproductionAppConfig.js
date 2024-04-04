import React from 'react';
export const AddSendOfReproductionAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/sendofreproduction/addsendofreproduction',
            component: React.lazy(() => import('./AddSendOfReproduction'))
        }
    ]
};
