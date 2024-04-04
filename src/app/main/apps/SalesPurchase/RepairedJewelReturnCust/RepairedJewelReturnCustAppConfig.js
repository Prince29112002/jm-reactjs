import React from 'react';
export const RepairedJewelReturnCustAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/repairedjewelreturncust',
            component: React.lazy(() => import('./RepairedJewelReturnCust'))
        }
    ]
};
