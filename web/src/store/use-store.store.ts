import {create} from "zustand";
import type {LoginUser} from "@sts/models/login-user";
import {persist} from "zustand/middleware";

type LoginStore = {
    user: LoginUser | null;
    setUser: (user: LoginUser | null) => void;
    logout: () => void;
};

export const useStore = create<LoginStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => {
                set({ user: null });
                useStore.persist.clearStorage();
            }
        }),
        {
            name: "auth-storage", // localStorage key
        }
    )
);