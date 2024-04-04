import React from 'react';
export const CollectionSizeWiseAppConfig = {
    settings: {
        layout: {
            config: {
                navbar: {
                    display: false
                },
                toolbar: {
                    display: true
                },
                footer: {
                    display: false
                },
                leftSidePanel: {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes: [
        {
            path: '/dashboard/design/collectionsizewise',
            component: React.lazy(() => import('./CollectionSizeWise'))
        }
    ]
};
