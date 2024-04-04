import React from 'react';
export const GenerateBarcodeAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/taggingretailer/generatebarcoderetailer',
            component: React.lazy(() => import('./GenerateBarcode'))
        }
    ]
};
