import React from 'react';
export const StockArticianReturnMetalAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/stockarticianreturnmrtal',
            component: React.lazy(() => import('./StockArticianReturnMetal'))
        }
    ]
};
