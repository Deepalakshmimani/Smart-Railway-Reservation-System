import { getTicketData } from "../services/bookingService.js";
import { generateTicketPDF } from "../utils/pdfGenerator.js";

export const downloadTicket = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const ticket = await getTicketData(bookingId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        generateTicketPDF(ticket, res);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};