import {Outlet} from "react-router";

export default function AuthLayout() {
    return (
            <div className={"flex justify-center items-center overflow-auto h-screen py-12 px-6 bg-[#e8efff]"}>
            <Outlet/>
        </div>
    )
}