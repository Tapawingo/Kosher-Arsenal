import type { User } from "lucia";

export default defineNuxtRouteMiddleware(async () => {
    const { data: user } = await useFetch<User>("/api/auth/user");
    if (!user.value) return navigateTo('/login');
})
