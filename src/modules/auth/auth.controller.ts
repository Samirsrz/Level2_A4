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



const googleLogin = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  
  const {idToken} = req.body;
  const {user, refreshToken,accessToken} = await authService.googleLoginDB(idToken);

  const {email,role,name} = user;

const isProd = process.env.NODE_ENV === "production"

res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: isProd,
  path:"/",
  sameSite: isProd ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24,
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: isProd,
  path:"/",
  sameSite: isProd ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logged in with Google successfully",
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

  
   
})



export const authController ={
    loginUser,
    getCurrentUser,
    googleLogin
}