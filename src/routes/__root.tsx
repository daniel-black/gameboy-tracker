import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      {/* We can add some layout stuff in here later */}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
