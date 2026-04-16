import dayjs from "dayjs";

export function formatDateTimeToDMY(date: Date | null): string {
    if (!date) {
        return "";
    }

    return dayjs(date).format('DD/MM/YYYY');
}