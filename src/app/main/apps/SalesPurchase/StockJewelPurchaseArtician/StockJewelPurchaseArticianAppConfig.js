import React from 'react';
export const StockJewelPurchaseArticianAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/stockjewelpurchaseartician',
            component: React.lazy(() => import('./StockJewelPurchaseArtician'))
        }
    ]
};
