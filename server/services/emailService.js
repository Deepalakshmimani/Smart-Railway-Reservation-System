import { transporter } from "../configs/mailConfig.js";
import { generateTicketBuffer } from "../utils/pdfBufferGenerator.js";
import { getTicketEmailTemplate } from "../templates/ticketEmailTemplate.js";

export const sendTicketEmail = async (ticket, userEmail) => {
  try {
    console.log("📄 Generating PDF Buffer...");
    const pdfBuffer = await generateTicketBuffer(ticket);
    console.log("✅ PDF Generated");

    const htmlContent = getTicketEmailTemplate(ticket);
    const fileName = `RailGo_${ticket.booking_code || "Ticket"}.pdf`;

    const mailOptions = {
      from: `"RailGo Express" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🎉 Your RailGo Ticket is Confirmed",
      html: htmlContent,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    console.log(`✉️ Sending Email to ${userEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email Sent Successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    // Graceful error capture so the booking isn't rolled back if email fails
    console.error("❌ Email Delivery Error:", error.message);
  }
};