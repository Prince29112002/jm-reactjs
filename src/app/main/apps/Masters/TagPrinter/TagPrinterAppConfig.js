import React from 'react';

export const TagPrinterAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/TagPrinter',
            component: React.lazy(() => import('./TagPrinter'))
        }
    ]
};
