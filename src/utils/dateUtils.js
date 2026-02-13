export const isOverlapping = (start1, end1, start2, end2) => {
    const s1 = new Date(start1).getTime();
    const e1 = new Date(end1).getTime();
    const s2 = new Date(start2).getTime();
    const e2 = new Date(end2).getTime();

    // Check if one event starts before the other ends
    return s1 < e2 && s2 < e1;
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
};

export const validateEventDates = (start, end) => {
    const now = new Date().getTime();
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();

    if (s < now) return "Event cannot start in the past.";
    if (e <= s) return "End time must be after start time.";
    return null;
};
