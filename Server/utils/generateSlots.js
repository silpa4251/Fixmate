const generateSlots = (startTime, endTime, intervalMinutes, bufferMinutes) => {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${startTime}:00`);
    const endDateTime = new Date(`1970-01-01T${endTime}:00`);

    while (currentTime < endDateTime) {
        const slotStart = currentTime.toTimeString().slice(0, 5); // Format as HH:mm
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);

        const slotEnd = currentTime.toTimeString().slice(0, 5);
        slots.push(`${slotStart} - ${slotEnd}`);

        // Add buffer time
        currentTime.setMinutes(currentTime.getMinutes() + bufferMinutes);
    }

    return slots;
};

const parseTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return [hour, minute];
}

const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

module.exports = { generateSlots, parseTime , formatTime};