import React from 'react';
export const AddSalesB2CInfoAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/b2csaleinfo/addsalesb2cinfo',
            component: React.lazy(() => import('./AddSalesB2CInfo'))
        }
    ]
};
