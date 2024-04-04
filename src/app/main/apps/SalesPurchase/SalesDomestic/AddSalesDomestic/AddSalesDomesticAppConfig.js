import React from 'react';
export const AddSalesDomesticAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/adddomesticsale',
            component: React.lazy(() => import('./AddSalesDomestic'))
        }
    ]
};
