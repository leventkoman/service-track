interface CustomerTypeBadgeProps {
    name: string;
    nameLocalized: string;
}

const customerTypeBadge: Record<string, {bg: string, text: string, border: string}> = {
    individual: {
        bg: 'bg-[#e3f2fd]',
        text: 'text-[#1565c0]',
        border: 'border-[#1565c0]',
    },
    corporate: {
        bg: 'bg-[#f3e5f5]',
        text: 'text-[#6a1b9a]',
        border: 'border-[#6a1b9a]',
    }
}

const defaultStyle = {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-400',
};

export function CustomerTypeBadge({name, nameLocalized}: CustomerTypeBadgeProps) {
    const style = customerTypeBadge[name] ?? defaultStyle;
    return (
        <>
            <span className={`${style.bg} ${style.text} ${style.border} rounded-full px-2 py-1 border text-sm`}>{nameLocalized}</span>
        </>
    )
}