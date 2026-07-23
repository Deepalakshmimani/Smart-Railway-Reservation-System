import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

/**
 * Helper to format 24h time to 12h AM/PM
 */
const formatTime = (timeStr) => {
  if (!timeStr) return "--:--";
  const [hour, minute] = timeStr.split(":");
  if (hour === undefined || minute === undefined) return timeStr;

  return new Date(2000, 0, 1, Number(hour), Number(minute)).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Draws Header with Logo and Title
 */
const drawHeader = (doc) => {
  const logoPath = path.join(process.cwd(), "assets", "logo.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 60 });
  }

  doc.fontSize(24).fillColor("#1E3A8A").text("RailGo", 130, 50);
  doc.fontSize(14).fillColor("gray").text("Electronic Train Ticket", 130, 80);

  doc
    .moveTo(50, 120)
    .lineTo(550, 120)
    .strokeColor("#1E3A8A")
    .stroke();

  return 140; // Initial dynamic Y after header
};

/**
 * Draws Booking Information Card
 */
const drawBookingInfo = (doc, ticket, startY) => {
  const cardHeight = 90;

  doc
    .roundedRect(50, startY, 500, cardHeight, 8)
    .fillAndStroke("#F9FAFB", "#D1D5DB");

  doc
    .fontSize(16)
    .fillColor("#111827")
    .text("Booking Information", 65, startY + 15);

  doc
    .fontSize(11)
    .fillColor("gray")
    .text("Booking Code", 65, startY + 45)
    .text("Status", 320, startY + 45);

  doc
    .fontSize(12)
    .fillColor("black")
    .text(ticket.booking_code || "N/A", 65, startY + 62);

  // Status Badge
  const statusText = ticket.status || "CONFIRMED";
  doc
    .roundedRect(320, startY + 60, 110, 22, 6)
    .fill("#22C55E");

  doc
    .fillColor("white")
    .fontSize(10)
    .text(statusText, 320, startY + 66, { width: 110, align: "center" });

  return startY + cardHeight + 20;
};

/**
 * Draws Journey Information Card
 */
const drawJourneyInfo = (doc, ticket, startY) => {
  const cardHeight = 180;

  doc
    .roundedRect(50, startY, 500, cardHeight, 8)
    .fillAndStroke("#F9FAFB", "#D1D5DB");

  doc
    .fontSize(16)
    .fillColor("#111827")
    .text("Journey Information", 65, startY + 15);

  // Row 1: Labels & Values
  doc
    .fontSize(11)
    .fillColor("gray")
    .text("Train Name", 65, startY + 45)
    .text("Train No", 320, startY + 45);

  doc
    .fontSize(12)
    .fillColor("black")
    .text(ticket.train_name || "N/A", 65, startY + 62)
    .text(ticket.train_no || ticket.train_number || "12601", 320, startY + 62);

  // Row 2: Labels & Values
  doc
    .fontSize(11)
    .fillColor("gray")
    .text("From", 65, startY + 90)
    .text("To", 320, startY + 90);

  doc
    .fontSize(12)
    .fillColor("black")
    .text(ticket.source || "N/A", 65, startY + 107)
    .text(ticket.destination || "N/A", 320, startY + 107);

  // Row 3: Labels & Values
  doc
    .fontSize(11)
    .fillColor("gray")
    .text("Travel Date", 65, startY + 135)
    .text("Time (Dep / Arr)", 320, startY + 135);

  const formattedDate = ticket.travel_date
    ? new Date(ticket.travel_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  // Fixed single-line string formatting
  const depTime = formatTime(ticket.departure_time);
  const arrTime = formatTime(ticket.arrival_time);
  const timeDisplay = `${depTime} / ${arrTime}`;

  doc
    .fontSize(12)
    .fillColor("black")
    .text(formattedDate, 65, startY + 152)
    .text(timeDisplay, 320, startY + 152);

  return startY + cardHeight + 20;
};

/**
 * Draws Dynamic Passenger Details Table
 */
const drawPassengerTable = (doc, ticket, startY) => {
  const passengers = ticket.passengers || [];
  const seats = ticket.seats || [];

  const headerHeight = 28;
  const rowHeight = 28;
  const paddingBottom = 15;

  // Calculate dynamic container height based on passenger count
  const contentHeight = 45 + headerHeight + (passengers.length * rowHeight) + paddingBottom;

  // Outer Card
  doc
    .roundedRect(50, startY, 500, contentHeight, 8)
    .fillAndStroke("#F9FAFB", "#D1D5DB");

  // Title
  doc
    .fontSize(16)
    .fillColor("#111827")
    .text("Passenger Details", 65, startY + 15);

  // Header Box
  const tableHeaderY = startY + 45;
  doc.rect(65, tableHeaderY, 470, headerHeight).fill("#1E3A8A");

  // Header Labels
  doc
    .fontSize(11)
    .fillColor("white")
    .text("No", 75, tableHeaderY + 8)
    .text("Name", 115, tableHeaderY + 8)
    .text("Age", 285, tableHeaderY + 8)
    .text("Gender", 350, tableHeaderY + 8)
    .text("Seat", 455, tableHeaderY + 8);

  let rowY = tableHeaderY + headerHeight + 8;

  passengers.forEach((passenger, index) => {
    const seat = seats[index];
    const seatText = seat ? `${seat.coach_name}-${seat.seat_number}` : "N/A";

    doc.fillColor("#111827").fontSize(10);

    doc.text((index + 1).toString(), 75, rowY);
    doc.text(passenger.passenger_name || passenger.name || "N/A", 115, rowY, {
      width: 160,
      ellipsis: true,
    });
    doc.text((passenger.age || "--").toString(), 285, rowY);
    doc.text(passenger.gender || "N/A", 350, rowY);
    doc.text(seatText, 455, rowY);

    // Horizontal Row Divider
    doc
      .moveTo(65, rowY + 20)
      .lineTo(535, rowY + 20)
      .strokeColor("#E5E7EB")
      .stroke();

    rowY += rowHeight;
  });

  return startY + contentHeight + 20;
};

/**
 * Draws Fare Summary & QR Code Section Side-by-Side
 */
const drawSummaryAndQR = async (doc, ticket, startY) => {
  const sectionHeight = 120;

  // 1. Fare Summary Card
  doc
    .roundedRect(50, startY, 300, sectionHeight, 8)
    .fillAndStroke("#F9FAFB", "#D1D5DB");

  doc
    .fontSize(14)
    .fillColor("#111827")
    .text("Fare Summary", 65, startY + 15);

  doc
    .fontSize(11)
    .fillColor("gray")
    .text("Coach Type:", 65, startY + 45)
    .text("Total Tickets:", 65, startY + 65);

  doc
    .fillColor("#111827")
    .text(ticket.coach_type || "GENERAL", 160, startY + 45)
    .text((ticket.total_tickets || ticket.passengers?.length || 1).toString(), 160, startY + 65);

  // Total Fare Highlight (Using 'Rs.' to avoid font encoding issues)
  doc
    .fontSize(12)
    .fillColor("#1E3A8A")
    .text("Total Fare:", 65, startY + 90);

  const amount = Number(ticket.total_amount || 0).toFixed(2);
  doc
    .fontSize(13)
    .fillColor("#15803D")
    .text(`Rs. ${amount}`, 160, startY + 89);

  // 2. QR Code (Right Side)
  try {
    const qrData = ticket.booking_code
      ? JSON.stringify({
          bookingId: ticket.booking_id || ticket.id,
          bookingCode: ticket.booking_code,
          train: ticket.train_no || ticket.train_number,
        })
      : `RAILGO-TICKET-${ticket.id || "VERIFY"}`;

    const qrDataURL = await QRCode.toDataURL(qrData, { margin: 1, width: 90 });
    const qrBuffer = Buffer.from(qrDataURL.split(",")[1], "base64");

    // Render QR Code Image
    doc.image(qrBuffer, 410, startY, { width: 90, height: 90 });

    // QR Sub-label
    doc
      .fontSize(9)
      .fillColor("gray")
      .text("Scan to Verify Ticket", 380, startY + 96, { width: 150, align: "center" });
  } catch (err) {
    console.error("Failed to generate QR code:", err);
  }

  return startY + sectionHeight + 25;
};

/**
 * Draws Footer Notice
 */
const drawFooter = (doc, startY) => {
  doc
    .moveTo(50, startY)
    .lineTo(550, startY)
    .strokeColor("#D1D5DB")
    .stroke();

  const footerY = startY + 12;

  doc
    .fontSize(10)
    .fillColor("#1E3A8A")
    .text("Thank you for choosing RailGo.", 50, footerY, { align: "center" });

  doc
    .fontSize(8)
    .fillColor("gray")
    .text("This is a computer-generated ticket. Carry a valid Government ID during travel.", 50, footerY + 16, { align: "center" })
    .text("Need Help? Contact support@railgo.com", 50, footerY + 28, { align: "center" });
};

/**
 * Main Controller Function
 */
export const generateTicketPDF = async (ticket, res) => {
  try {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ticket.pdf"
    );

    doc.pipe(res);

    // Sequential Layout Execution via currentY tracking
    let currentY = drawHeader(doc);
    currentY = drawBookingInfo(doc, ticket, currentY);
    currentY = drawJourneyInfo(doc, ticket, currentY);
    currentY = drawPassengerTable(doc, ticket, currentY);
    currentY = await drawSummaryAndQR(doc, ticket, currentY);
    drawFooter(doc, currentY);

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate ticket PDF" });
    }
  }
};