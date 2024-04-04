import React from 'react';
export const AddSalesB2CAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salesb2c/addsalesb2c',
            component: React.lazy(() => import('./AddSalesB2C'))
        }
    ]
};
