import React from 'react';

export const JobwokerVendorRateProfAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/jobworkervendorrateprof',
            component: React.lazy(() => import('./JobwokerVendorRateProf'))
        }
    ]
};
