import React from 'react';

export const StockNameAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/stockname',
            component: React.lazy(() => import('./StockName'))
        }
    ]
};
