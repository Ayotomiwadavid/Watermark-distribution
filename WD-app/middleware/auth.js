export default defineNuxtRouteMiddleware((to, from) => {
  // Ensure this code only runs on the client
  if (process.client) {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    // Redirect to sign-in if no token is found
    if (!accessToken) {
      if (to.path.startsWith("/admin")) {
        return navigateTo("/admin/signin");
      }
      if (to.path.startsWith("/dashboard")) {
        return navigateTo("/signin");
      }
    }

    // Protect admin routes
    if (to.path.startsWith("/admin") && role !== "Admin") {
      return navigateTo("/admin/signin");
    }

    // Protect user dashboard routes
    if (to.path.startsWith("/dashboard") && role !== "User") {
      return navigateTo("/signin");
    }
  }
});
