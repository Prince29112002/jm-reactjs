import React from 'react';

export const CompanyAssociationAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/companyassociation",
            component: React.lazy(() => import('./CompanyAssociation'))
        }
    ]
};


