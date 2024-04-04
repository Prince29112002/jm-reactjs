import React from 'react';
export const PurchaseReportsRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/purchaserepotsretailer',
            component: React.lazy(() => import('./PurchaseReportsRetailer'))
        }
    ]
};
