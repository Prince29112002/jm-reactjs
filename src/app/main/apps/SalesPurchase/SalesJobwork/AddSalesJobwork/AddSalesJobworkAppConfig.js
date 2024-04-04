import React from 'react';
export const AddSalesJobworkAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addsalejobwork',
            component: React.lazy(() => import('./AddSalesJobwork'))
        }
    ]
};
