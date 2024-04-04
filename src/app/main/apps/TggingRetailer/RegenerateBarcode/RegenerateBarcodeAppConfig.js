import React from 'react';
export const RegenerateBarcodeAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/taggingretailer/regeneratebarcoderetailer',
            component: React.lazy(() => import('./RegenerateBarcode'))
        }
    ]
};
