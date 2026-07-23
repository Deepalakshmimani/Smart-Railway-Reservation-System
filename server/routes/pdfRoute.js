import express from "express";
import { downloadTicket } from "../controllers/pdfController.js";

const pdfRouter = express.Router();

pdfRouter.get("/download/:bookingId", downloadTicket);

export default pdfRouter;