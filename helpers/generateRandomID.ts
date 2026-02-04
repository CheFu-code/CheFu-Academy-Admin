export const generateTicketID = () => {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const bytes = crypto.getRandomValues(new Uint8Array(9));
    const id = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
    return `TICKET-${id}`;
};