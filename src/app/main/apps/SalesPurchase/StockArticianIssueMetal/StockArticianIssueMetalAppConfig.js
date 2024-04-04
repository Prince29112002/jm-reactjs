import React from 'react';
export const StockArticianIssueMetalAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/stockarticianissuemetal',
            component: React.lazy(() => import('./StockArticianIssueMetal'))
        }
    ]
};
