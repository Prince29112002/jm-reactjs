import React from 'react';
import {Divider, List, Hidden} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import FuseNavVerticalGroup from './vertical/FuseNavVerticalGroup';
import FuseNavVerticalCollapse from './vertical/FuseNavVerticalCollapse';
import FuseNavVerticalItem from './vertical/FuseNavVerticalItem';
import FuseNavVerticalLink from './vertical/FuseNavVerticalLink';
import FuseNavHorizontalGroup from './horizontal/FuseNavHorizontalGroup';
import FuseNavHorizontalCollapse from './horizontal/FuseNavHorizontalCollapse';
import FuseNavHorizontalItem from './horizontal/FuseNavHorizontalItem';
import FuseNavHorizontalLink from './horizontal/FuseNavHorizontalLink';

function FuseNavigation(props)
{
    const {navigation, layout, active, dense, className} = props;
    const verticalNav = (
        <List className={clsx("navigation whitespace-no-wrap", className)}>
            {navigation.length>0 &&
                navigation.map((item) => (

                    <React.Fragment key={item.id}>

                        {item.type === 'group' && (
                            <FuseNavVerticalGroup item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'collapse' && item.isAccessible && (
                            <FuseNavVerticalCollapse item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'item' && item.isAccessible && (
                            <FuseNavVerticalItem item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'link' && (
                            <FuseNavVerticalLink item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'divider' && (
                            <Divider className="my-0"/>
                        )}
                    </React.Fragment>
                ))
            }
        </List>
    );

    const horizontalNav = (
        <List className={clsx("navigation whitespace-no-wrap flex p-0", className)}>
            {navigation.length>0 &&
                navigation.map((item) => (

                    <React.Fragment key={item.id}>

                        {item.type === 'group' && (
                            <FuseNavHorizontalGroup item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'collapse' && item.isAccessible && (
                            <FuseNavHorizontalCollapse item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'item' && item.isAccessible && (
                            <FuseNavHorizontalItem item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'link' && (
                            <FuseNavHorizontalLink item={item} nestedLevel={0} active={active} dense={dense}/>
                        )}

                        {item.type === 'divider' && (
                            <Divider className="my-16"/>
                        )}
                    </React.Fragment>
                ))
            }
        </List>
    );

    if ( navigation.length > 0 )
    {
        switch ( layout )
        {
            case 'horizontal':
            {
                return (
                    <React.Fragment>
                        <Hidden lgUp>
                            {verticalNav}
                        </Hidden>
                        <Hidden mdDown>
                            {horizontalNav}
                        </Hidden>
                    </React.Fragment>
                )
            }
            case 'vertical':
            default:
            {
                return verticalNav;
            }
        }
    }
    else
    {
        return null;
    }
}

FuseNavigation.propTypes = {
    navigation: PropTypes.array.isRequired
};

FuseNavigation.defaultProps = {
    layout: "vertical"
};

export default React.memo(FuseNavigation);
