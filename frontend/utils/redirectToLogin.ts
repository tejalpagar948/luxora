import type { NavigateFunction } from "react-router-dom";

export const redirectToLogin = (
    navigate: NavigateFunction,
    pathname: string
) => {
    navigate("/login", {
        state: {
            from: pathname,
        },
    });
};