import React from "react";
import { Redirect } from "react-router-dom";
import { FuseUtils } from "@fuse/index";
import { appsConfigs } from "app/main/apps/appsConfigs";
import { pagesConfigs } from "app/main/pages/pagesConfigs";
import { MainDashboardAppConfig } from "app/main/mainDashboard/MainDashboardAppConfig";
import { LoginConfig } from "app/main/login/LoginConfig";
import { ViewCatalogueAppConfig } from "app/main/ViewCatalogue/ViewCatalogueAppConfig";
import { ForgotPasswordPageConfig } from "app/main/forgot-password/ForgotPasswordPageConfig";
import {ResetPasswordPageConfig} from 'app/main/reset-password/ResetPasswordPageConfig';
import { RegisterPageConfig } from "app/main/register/RegisterPageConfig";
import { LogoutConfig } from "app/main/logout/LogoutConfig";
import { CallbackConfig } from "app/main/callback/CallbackConfig";
import { Error404PageConfig } from "app/main/errors/404/Error404PageConfig";
import { authRoles } from "app/auth";
import _ from "lodash";
import { OuterPageAppConfig } from "app/main/OuterPage/OuterPageAppConfig";

function setAdminAuth(configs) {
  return configs.map((config) =>
    _.merge({}, config, { auth: authRoles.admin })
  );
}

const routeConfigs = [
  ...setAdminAuth([
    ...appsConfigs,
    ...pagesConfigs,
    Error404PageConfig,
    MainDashboardAppConfig,
    LogoutConfig,
  ]),
  // LoginPageConfig,
  OuterPageAppConfig,
  ViewCatalogueAppConfig,
  LoginConfig,
  ForgotPasswordPageConfig,
  ResetPasswordPageConfig,
  RegisterPageConfig,
  CallbackConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
  {
    path: "/",
    exact: true,
    // component: () => <Redirect to="/apps/dashboards/analytics"/>
    component: () => <Redirect to="/dashboard" />,
  },
  {
    component: () => <Redirect to="/errors/error-404" />,
  },
];

export default routes;
