import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.user?.id;
  const { rentalRequestId } = req.body;

  const result = await paymentService.createPaymentDB(tenantId as string, rentalRequestId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment session created",
    data: result,
  });
});


const confirmPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { transactionId } = req.body;

  const result = await paymentService.confirmPaymentDB(transactionId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment confirmed",
    data: result,
  });
});

export const paymentController = {
    createPayment,
    confirmPayment
}