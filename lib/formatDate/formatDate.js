import { formatDistanceToNow } from 'date-fns'
import { ru } from "date-fns/locale"

export const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
};