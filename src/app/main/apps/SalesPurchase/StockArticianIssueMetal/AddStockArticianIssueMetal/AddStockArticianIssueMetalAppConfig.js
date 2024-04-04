import React from 'react';
export const AddStockArticianIssueMetalAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/stockarticianissuemetal/addstockarticianissuemetal',
            component: React.lazy(() => import('./AddStockArticianIssueMetal'))
        }
    ]
};
