import React from 'react';
export const AddRepairingRecfromCustAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addrepairingrecfromcust',
            component: React.lazy(() => import('./AddRepairingRecfromCust'))
        }
    ]
};
