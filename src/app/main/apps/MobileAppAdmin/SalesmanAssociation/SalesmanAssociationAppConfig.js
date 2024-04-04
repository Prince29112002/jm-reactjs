import React from 'react';

export const SalesmanAssociationAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/salesmanassociation",
            component: React.lazy(() => import('./SalesmanAssociation'))
        }
    ]
};


