import React from 'react';

export const TagPrinterRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/tagprinterretailer',
            component: React.lazy(() => import('./TagPrinterRetailer'))
        }
    ]
};
