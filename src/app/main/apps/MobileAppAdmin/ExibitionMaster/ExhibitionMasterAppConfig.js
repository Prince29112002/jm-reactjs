import React from 'react';

export const ExhibitionMasterAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/exhibitionmaster",
            component: React.lazy(() => import('./ExhibitionMaster'))
        }
    ]
};


