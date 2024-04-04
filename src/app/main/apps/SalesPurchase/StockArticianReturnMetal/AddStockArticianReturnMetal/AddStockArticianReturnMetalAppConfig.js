import React from 'react';
export const AddStockArticianReturnMetalAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/stockarticianreturnmrtal/addstockarticianreturnmetal',
            component: React.lazy(() => import('./AddStockArticianReturnMetal'))
        }
    ]
};
