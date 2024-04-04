import React from 'react';
export const AddSalesJobworkInfoAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salejobworkinfo/addsalejobworkinfo',
            component: React.lazy(() => import('./AddSalesJobworkInfo'))
        }
    ]
};
