import React from 'react';

export const OtherLeadAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/otherlead",
            component: React.lazy(() => import('./OtherLead'))
        }
    ]
};


