interface StatusBadgeProps {
    name: string;
    nameLocalized: string;
}

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    pending: {
        bg: 'bg-[#efbb5a3d]',
        text: 'text-black',
        border: 'border-amber-600',
    },

    in_progress: {
        bg: 'bg-[#e3f2fd]',
        text: 'text-[#1565c0]',
        border: 'border-[#1565c0]',
    },

    in_workshop: {
        bg: 'bg-[#ede7f6]',
        text: 'text-[#5e35b1]',
        border: 'border-[#5e35b1]',
    },

    waiting_parts: {
        bg: 'bg-[#fff8e1]',       
        text: 'text-[#8d6e00]',    
        border: 'border-[#fbc02d]' 
    },

    awaiting_notification: {
        bg: 'bg-[#f3e5f5]',
        text: 'text-[#8e24aa]',
        border: 'border-[#8e24aa]',
    },

    done: {
        bg: 'bg-green-50',
        text: 'text-green-800',
        border: 'border-green-400',
    },
    active: {
        bg: 'bg-green-50',
        text: 'black',
        border: 'border-green-400',
    },
    // individual: {
    //     bg: 'bg-[#e3f2fd]',
    //     text: 'text-[#1565c0]',
    //     border: 'border-[#1565c0]',
    // },
    // corporate: {
    //     bg: 'bg-[#f3e5f5]',
    //     text: 'text-[#6a1b9a]',
    //     border: 'border-[#6a1b9a]',
    // }
};

const defaultStyle = {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-400',
};

export default function StatusBadge({name, nameLocalized}: StatusBadgeProps) {
    const style = statusStyles[name] ?? defaultStyle;
    return (
        <>
            <span
                className={`${style.bg} ${style.text} ${style.border} rounded-full px-2 py-1 border text-sm`}>{nameLocalized}</span>
        </>
    )
}