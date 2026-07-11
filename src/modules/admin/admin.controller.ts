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



const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const { status } = req.body;

  const result = await adminService.updateUserStatusDB(userId as string, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});


const getAllProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAllPropertiesDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All properties retrieved successfully",
    data: result,
  });
});



const getAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAllRentalsDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All rental requests retrieved successfully",
    data: result,
  });
});

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals
}