import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"




const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payLoad = req.body;
    const { user, refreshToken, accessToken } =
      await authService.loginUserDB(payLoad);
    const { email, role, name } = user;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged in successfully",
      data: {
        user: {
          name,
          email,
          role,
        },
        refreshToken,
        accessToken,
      },
    });
  },
);


// To get current user
const getCurrentUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    sendResponse(res,{
    success: true,
    statusCode: httpStatus.OK,
    message: "Current user retrieved successfully",
    data: {
      user: req.user
    }
    })
})





export const authController ={
    loginUser,
    getCurrentUser
}