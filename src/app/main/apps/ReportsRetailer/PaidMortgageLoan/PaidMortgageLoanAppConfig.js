import React from 'react';
export const PaidMortgageLoanAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/paidmortgageloan',
            component: React.lazy(() => import('./PaidMortgageLoan'))
        }
    ]
};
