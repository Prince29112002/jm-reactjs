import React from 'react';
export const AddStockJewelPurchaseArticianAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/stockjewelpurchaseartician/addstockjewelpurchaseartician',
            component: React.lazy(() => import('./AddStockJewelPurchaseArtician'))
        }
    ]
};
