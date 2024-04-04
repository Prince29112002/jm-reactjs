import React from 'react';
export const AddRepairedJewelReturnCustAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addrepairedjewelreturncust',
            component: React.lazy(() => import('./AddRepairedJewelReturnCust'))
        }
    ]
};
