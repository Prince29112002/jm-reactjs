import React from 'react';
export const RepairingRecfromCustAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/repairingrecfromcust',
            component: React.lazy(() => import('./RepairingRecfromCust'))
        }
    ]
};
