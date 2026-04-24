import type {ReactNode} from "react";

interface StatsCardProps {
    name: string;
    value: string | number | undefined;
    icon: ReactNode;
    iconBg: string | undefined;
    glow: string;
}

export default function StatsCard({name, value, icon, iconBg, glow}: StatsCardProps) {
    return (
        <div
            key={name}
            className={`group relative bg-white dark:bg-gray-900 overflow-hidden rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl ${glow} transition-all duration-300`}
        >
            {/* Glow blob */}
            <div
                className={`absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br ${iconBg} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
            />

            <div className="relative z-10 flex justify-between items-start mb-4">
                <p className="text-gray-700 dark:text-gray-700 font-medium text-lg">{name}</p>
                <div
                    className={`p-3 rounded-2xl bg-linear-to-br ${iconBg} text-white shadow-lg`}>
                    {icon}
                </div>

            </div>
            <div className="relative z-10">
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
        </div>
    );
}