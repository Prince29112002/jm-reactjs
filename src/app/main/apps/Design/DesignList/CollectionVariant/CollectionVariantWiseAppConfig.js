import React from 'react';
export const CollectionVariantWiseAppConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: true
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/design/collectionvarinatwise',
            component: React.lazy(() => import('./CollectionVariantWise'))
        }
    ]
};
