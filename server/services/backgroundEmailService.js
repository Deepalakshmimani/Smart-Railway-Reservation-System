import {
    getTicketData,
    getUserEmailById
} from "./bookingService.js";

import {
    sendTicketEmail
} from "./emailService.js";

export const sendBookingEmailInBackground = async (bookingId) => {

    try {

        console.log("📩 Background email started");

        const ticket = await getTicketData(bookingId);

        if (!ticket) {
            console.log("❌ Ticket not found");
            return;
        }

        const userEmail = await getUserEmailById(ticket.user_id);

        if (!userEmail) {
            console.log("❌ User email not found");
            return;
        }

        await sendTicketEmail(ticket, userEmail);

        console.log("✅ Background email sent");

    }

    catch (error) {

        console.error("Background Email Error:", error);

    }

};