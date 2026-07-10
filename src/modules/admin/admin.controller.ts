import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAllUsersDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    data: result,
  });
});


export const adminController = {
    getAllUsers
}