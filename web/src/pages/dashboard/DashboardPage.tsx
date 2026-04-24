import {
    PeopleAlt,
    CurrencyExchange,
    EmojiPeople, Diversity3, CheckCircle, Cancel, PendingActions, Build, DoneAll, Business, Notifications, Wallet
} from '@mui/icons-material';
import {useEffect, useState} from "react";
import {DashboardService} from "@stf/features/dashboard/services/dashboard.service";
import StatsCard from "../../compnents/common/StatsCard";
import {useStore} from "@stf/store/use-store.store";
import {Role} from "api/src/enums/role.enum";
import type {Stat} from "@sts/models/stat.model";

export const statusUIList = [
    {
        icon: <EmojiPeople sx={{ fontSize: 24 }} />,
        color: "from-green-400 to-green-600",
    },
    {
        icon: <CheckCircle sx={{ fontSize: 24 }} />,
        color: "from-blue-400 to-blue-600",
    },
    {
        icon: <Cancel sx={{ fontSize: 24 }} />,
        color: "from-red-400 to-red-600",
    },
    {
        icon: <PendingActions sx={{ fontSize: 24 }} />,
        color: "from-yellow-400 to-yellow-600",
    },
    {
        icon: <Build sx={{ fontSize: 24 }} />,
        color: "from-purple-400 to-purple-600",
    },
    {
        icon: <DoneAll sx={{ fontSize: 24 }} />,
        color: "from-indigo-400 to-indigo-600",
    },
];

export default function DashboardPage() {
    const [data, setData] = useState<Stat | null>(null);
    const state = useStore();
    const fetchData = async () => {
        try {
            const response = await DashboardService.getAllDashboards();
            setData(response.data);
        } catch (e: any) {
            console.error(e);
        }
    }

    useEffect(() => {
        (async () => {
            await fetchData();
        })();
    }, []);
    
    
    return (
        <div className="space-y-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
                <StatsCard 
                    name={state.user?.roles.includes(Role.SUPER_ADMIN) ? "Firmaların Toplam Hasılatı" : "Toplam Hasılat"} 
                    value={data?.revenueTotal} 
                    icon={<Wallet sx={{fontSize: 24}}/>} 
                    iconBg="from-purple-500 to-purple-600" 
                    glow="rose"
                />
                <StatsCard
                    name={"Toplam Müşteri"}
                    value={data?.customerCount}
                    icon={<Diversity3 sx={{fontSize: 24}}/>}
                    iconBg="from-orange-400 to-rose-500"
                    glow="rose"
                />
                <StatsCard
                    name={"Toplam Çalışan"}
                    value={data?.users.total}
                    icon={<PeopleAlt sx={{fontSize: 24}}/>}
                    iconBg="from-blue-500 to-indigo-600"
                    glow="rose"
                />
                <StatsCard
                    name={"Aktif Çalışan"}
                    value={data?.users.active}
                    icon={<EmojiPeople sx={{fontSize: 24}}/>}
                    iconBg="from-green-400 to-gray-600"
                    glow="rose"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.subscriptionCount && (
                    <>
                        <StatsCard
                            name={"Toplam Abone"}
                            value={data?.subscriptionCount?.total}
                            icon={<CurrencyExchange sx={{fontSize: 24}}/>}
                            iconBg="from-red-400 to-red-600"
                            glow="rose"
                        />
                        <StatsCard
                            name={"Aktif Abone"}
                            value={data?.subscriptionCount?.active}
                            icon={<Notifications sx={{fontSize: 24}}/>}
                            iconBg="from-green-400 to-green-600"
                            glow="rose"
                        />
                    </>
                )}
                
                {data?.serviceProviderCount && (
                    <StatsCard
                        name={"Toplam Firma"}
                        value={data?.serviceProviderCount}
                        icon={<Business sx={{fontSize: 24}}/>}
                        iconBg="from-yellow-400 to-yellow-600"
                        glow="rose"
                    />
                )}
                {!state.user?.roles.includes(Role.SUPER_ADMIN) && data?.serviceRequests?.map((stat, i: number) => {
                    const ui = statusUIList[i % statusUIList.length];
                    return (
                        <StatsCard
                            key={i}
                            name={stat?.nameLocalized}
                            value={stat?.count}
                            icon={ui?.icon}
                            iconBg={ui?.color}
                            glow="group-hover:shadow-lg"
                        />
                    )
                })}
            </div>
        </div>
    );
}