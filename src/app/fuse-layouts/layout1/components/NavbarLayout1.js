import React from "react";
import { AppBar } from "@material-ui/core";
import { FuseScrollbars } from "@fuse";
import clsx from "clsx";
import Logo from "app/fuse-layouts/shared-components/Logo";
import Navigation from "app/fuse-layouts/shared-components/Navigation";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    overflow: "scroll !important",
  },
  content: {
    // overflowX                   : 'hidden',
    // overflowY                   : 'auto',
    overflow: "auto",
    "-webkit-overflow-scrolling": "touch",
    background:
      "linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 30%), linear-gradient(rgba(0, 0, 0, 0.25) 0, rgba(0, 0, 0, 0) 40%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 40px, 100% 10px",
    backgroundAttachment: "local, scroll",
  },
});

function NavbarLayout1(props) {
  const classes = useStyles();

  return (
    <div
      className={clsx("flex flex-col overflow-hidden h-full", props.className)}
      style={{ marginBottom: "30%" }}
    >
      {/* color="primary" */}

      <AppBar
        position="static"
        elevation={0}
        className="flex  items-center flex-shrink h-76 min-h-76 pl-12 pr-12" //flex-row
        style={{ backgroundColor: "dimgrey" }}
      >
        <div className="flex flex-1 pr-8">
          <Logo />
        </div>

        {/* <Hidden mdDown>
                    <NavbarFoldedToggleButton className="w-40 h-40 p-0"/>
                </Hidden>

                <Hidden lgUp>
                    <NavbarMobileToggleButton className="w-40 h-40 p-0">
                        <Icon>arrow_back</Icon>
                    </NavbarMobileToggleButton>
                </Hidden> */}
      </AppBar>

      <FuseScrollbars className={clsx(classes.content, classes.root)}>
        {/* ,"mb-72" */}
        {/* <UserNavbarHeader/> */}
        <Navigation layout="vertical" />
      </FuseScrollbars>
    </div>
  );
}

export default NavbarLayout1;
