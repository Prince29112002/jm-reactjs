import React from 'react';
export const EditPacketAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/tagging/editpacket',
            component: React.lazy(() => import('./EditPacket'))
        }
    ]
};
