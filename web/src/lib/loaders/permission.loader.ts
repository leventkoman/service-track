import {useStore} from "@stf/store/use-store.store";
import {redirect} from "react-router";

export const permissionLoader = (allowedRoles: string[]) => () => {
    const state = useStore.getState();
    const user = state.user;
    
    if (!user) {
        state.logout();
        return redirect('/auth/login');
    }
    
    const hasPermission = user.roles.some(role => allowedRoles.includes(role));
    if (!hasPermission) {
        state.logout();
        return redirect('/auth/login');
    }

    return null;
};