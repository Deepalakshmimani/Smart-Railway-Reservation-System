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
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("Recipient:", userEmail);

    console.log(`✉️ Sending Email to ${userEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email Sent Successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    // Graceful error capture so the booking isn't rolled back if email fails
    console.error("❌ Email Delivery Error:", error.message);
  }
};


export const sendWaitingListConfirmationEmail = async (
    ticket,
    userEmail
) => {

    try {

        const pdfBuffer =
            await generateTicketBuffer(ticket);

        const html = `
        <h2>🎉 Waiting List Confirmed!</h2>

        <p>Dear Passenger,</p>

        <p>

        Great news!

        Your waiting list booking has now been
        <b>CONFIRMED</b>.

        </p>

        <p>

        <b>Booking Code :</b>

        ${ticket.booking_code}

        </p>

        <p>

        Your ticket is attached with this email.

        </p>

        <p>

        Thank you for choosing RailGo.

        </p>
        `;

        await transporter.sendMail({

            from: `"RailGo" <${process.env.EMAIL_USER}>`,

            to: userEmail,

            subject:
            "🎉 Your Waiting List has been Confirmed",

            html,

            attachments: [

                {

                    filename:
                    `RailGo_${ticket.booking_code}.pdf`,

                    content: pdfBuffer

                }

            ]

        });

    }

    catch(error){

        console.log(error);

    }

};

export const sendCancellationEmail = async (
    booking,
    userEmail,
    refund
) => {

    try {

        const html = `
            <h2>❌ Ticket Cancelled Successfully</h2>

            <p>Dear Passenger,</p>

            <p>
                Your RailGo ticket has been cancelled successfully.
            </p>

            <hr>

            <h3>Cancellation Details</h3>

            <p><strong>Booking Code:</strong> ${booking.booking_code}</p>

            <p><strong>Refund Amount:</strong> ₹${refund.refundAmount}</p>

            <p><strong>Cancellation Charge:</strong> ₹${refund.cancellationCharge}</p>

            <p><strong>Refund Policy:</strong> ${refund.policy}</p>

            <hr>

            <p>
                Your refund will be processed according to the applicable policy.
            </p>

            <p>
                Thank you for choosing <b>RailGo</b>.
            </p>

            <br>

            <p>
                Regards,<br>
                <b>RailGo Support Team</b>
            </p>
        `;

        const mailOptions = {

            from: `"RailGo Express" <${process.env.EMAIL_USER}>`,

            to: userEmail,

            subject: "❌ RailGo Ticket Cancellation Confirmation",

            html

        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Cancellation Email Sent:", info.messageId);

        return info;

    } catch (error) {

        console.error(
            "❌ Cancellation Email Error:",
            error.message
        );

    }

};