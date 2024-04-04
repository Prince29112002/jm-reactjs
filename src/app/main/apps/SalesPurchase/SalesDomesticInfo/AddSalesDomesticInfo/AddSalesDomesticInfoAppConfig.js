import React from 'react';
export const AddSalesDomesticInfoAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/domesticsaleinfo/adddomesticsaleinfo',
            component: React.lazy(() => import('./AddSalesDomesticInfo'))
        }
    ]
};
