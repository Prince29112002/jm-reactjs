import React from 'react';
export const ReGenBarcodeAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/tagging/regenbarcode',
            component: React.lazy(() => import('./ReGenBarcode'))
        }
    ]
};
