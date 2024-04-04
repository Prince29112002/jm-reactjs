import React from 'react';
export const OldJewelleryPurchaseReportsRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/oldjewellerypurchasereportsretailer',
            component: React.lazy(() => import('./OldJewelleryPurchaseReportsRetailer'))
        }
    ]
};
