export function getNumberLeadingZero(number) {
    return String("00" + number).slice(-2) || '';
}

export function getHourDateRange(fromDate, toDate) {
    return getNumberLeadingZero(fromDate.getHours()) + ':' + getNumberLeadingZero(fromDate.getMinutes()) + ' - '
        + getNumberLeadingZero(toDate.getHours()) + ':' + getNumberLeadingZero(toDate.getMinutes()) + ' '
        + fromDate.getFullYear() + '-' + getNumberLeadingZero((fromDate.getMonth() + 1)) + '-' + fromDate.getUTCDate();

}