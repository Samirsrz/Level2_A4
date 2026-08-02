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


const getMyPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.user?.id;

  const result = await paymentService.getMyPaymentsDB(tenantId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history retrieved successfully",
    data: result,
  });
});



const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paymentId = req.params.id;
  const userId = req.user?.id;

  const result = await paymentService.getPaymentByIdDB(paymentId as string, userId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});


const getLandlordEarnings = catchAsync(async (req, res) => {
  const result = await paymentService.getLandlordEarningsDB(req.user!.id)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Earnings fetched successfully",
    data: result,
  })
})

export const paymentController = {
    createPayment,
    confirmPayment,
    getMyPayments,
    getPaymentById,
    getLandlordEarnings
}