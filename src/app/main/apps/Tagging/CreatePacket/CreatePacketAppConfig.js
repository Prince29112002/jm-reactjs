import React from 'react';
export const CreatePacketAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/tagging/createpacket',
            component: React.lazy(() => import('./CreatePacket'))
        }
    ]
};
