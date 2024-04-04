import React from 'react';
export const SalesReturnDomesticAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salesreturndomestic',
            component: React.lazy(() => import('./SalesReturnDomestic'))
        }
    ]
};
