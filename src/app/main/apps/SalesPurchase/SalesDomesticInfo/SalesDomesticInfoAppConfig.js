import React from 'react';
export const SalesDomesticInfoAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/domesticsaleinfo',
            component: React.lazy(() => import('./SalesDomesticInfo'))
        }
    ]
};