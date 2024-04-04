import React from 'react';
export const AcceptStockTransAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/stock/accepttransferstock',
            component: React.lazy(() => import('./AcceptStockTransfer'))
        }
    ]
};
