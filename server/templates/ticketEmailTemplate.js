export const getTicketEmailTemplate = (ticket) => {
  const primaryPassenger = ticket.passengers?.[0]?.passenger_name || ticket.passengers?.[0]?.name || "Passenger";
  
  const formattedDate = ticket.travel_date
    ? new Date(ticket.travel_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Ticket Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
          
          <!-- Header -->
          <div style="background-color: #1E3A8A; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px;">RailGo</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #93c5fd;">Booking Confirmation</p>
          </div>

          <!-- Body -->
          <div style="padding: 24px; color: #1f2937;">
            <p style="font-size: 16px; margin-top: 0;">Dear <strong>${primaryPassenger}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.5; color: #4b5563;">
              Your booking has been successfully confirmed. Below are your journey details:
            </p>

            <!-- Info Box -->
            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Booking Code:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #111827; text-align: right;">${ticket.booking_code || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Train:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #111827; text-align: right;">${ticket.train_name || "Train"} (${ticket.train_no || ticket.train_number || ""})</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Route:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #111827; text-align: right;">${ticket.source || "N/A"} → ${ticket.destination || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Travel Date:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #111827; text-align: right;">${formattedDate}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 14px; color: #4b5563;">
              Please find your official E-Ticket attached as a PDF document. You must carry a valid Government ID along with this ticket during travel.
            </p>

            <p style="font-size: 14px; color: #4b5563; margin-bottom: 0;">
              Thank you for choosing RailGo!<br>
              <strong>Team RailGo</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            Need help? Contact <a href="mailto:support@railgo.com" style="color: #1E3A8A; text-decoration: none;">support@railgo.com</a>
          </div>

        </div>
      </body>
    </html>
  `;
};