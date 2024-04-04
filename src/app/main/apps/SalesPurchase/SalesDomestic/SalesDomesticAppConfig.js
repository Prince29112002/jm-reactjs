import React from 'react';
export const SalesDomesticAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/domesticsale',
            component: React.lazy(() => import('./SalesDomestic'))
        }
    ]
};
