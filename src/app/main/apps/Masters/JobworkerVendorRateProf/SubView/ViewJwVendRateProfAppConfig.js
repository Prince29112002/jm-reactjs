import React from 'react';

export const ViewJwVendRateProfAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/viewjwvendrateprofile',
            component: React.lazy(() => import('./ViewJwVendRateProf'))
        }
    ]
};
