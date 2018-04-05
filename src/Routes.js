import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "./components/AsyncComponent";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

const AsyncNotFound = asyncComponent(() => import("./containers/NotFound/NotFound"));
const AsyncWorkspaces = asyncComponent(() => import("./containers/Workspaces/Index"));
const AsyncLogin = asyncComponent(() => import("./containers/Login/Login"));
const AsyncSignup = asyncComponent(() => import("./containers/Signup/Signup"));
const AsyncWorkspaceDetails = asyncComponent(() => import("./containers/WorkspaceDetails/Index"));
const AsyncSourceDetails = asyncComponent(() => import("./containers/Sources/Details/Index"));
const AsyncTableDetails = asyncComponent(() => import("./containers/TableDetails/Index"));
const AsyncDestinationCreate = asyncComponent(() => import("./containers/Destinations/Create/Index"));
const AsyncSourceCreate = asyncComponent(() => import("./containers/Sources/Create/Index"));
const AsyncDestinationDetails = asyncComponent(() => import("./containers/Destinations/Details/Index"));

export default ({ childProps }) =>
  <Switch>
    <AuthenticatedRoute path="/" exact component={AsyncWorkspaces} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={AsyncLogin} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={AsyncSignup} props={childProps} />
    <AuthenticatedRoute path="/w/:id" exact component={AsyncWorkspaceDetails} props={childProps} />
    <AuthenticatedRoute path="/w/:workspaceId/source/create" exact component={AsyncSourceCreate} props={childProps} />
    <AuthenticatedRoute path="/w/:workspaceId/sources/:sourceId" exact component={AsyncSourceDetails} props={childProps} />
    <AuthenticatedRoute path="/w/:workspaceId/sources/:sourceId/tables/:tableId" exact component={AsyncTableDetails} props={childProps} />
    <AuthenticatedRoute path="/w/:workspaceId/destination/create" exact component={AsyncDestinationCreate} props={childProps} />
    <AuthenticatedRoute path="/w/:workspaceId/destinations/:destinationId" exact component={AsyncDestinationDetails} props={childProps} />


    { /* Finally, catch all unmatched routes */ }
    <Route component={AsyncNotFound} />
  </Switch>;
