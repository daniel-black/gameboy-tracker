import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      {/* We can add some layout stuff in here later */}
      <Outlet />
      {/* Hide dev tools for a sec */}
      {/* <TanStackRouterDevtools position="top-right" /> */}
    </>
  ),
});
