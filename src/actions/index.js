"use server";

import connectToDB from "@/database";
import User from "@/models";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function registerUserAction(formData) {
  await connectToDB();
  try {
    const { userName, email, password } = formData;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return {
        success: false,
        message: "User already exist! Please try with different email",
        alert: "User Exist Already",
      };
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    console.log("Hashed", hashedPassword);

    const newlyCreatedUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newlyCreatedUser.save();
    if (savedUser) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(savedUser)),
      };
    } else {
      return {
        success: false,
        message: "Something error occured! Please try again!",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something error occured! Please try again!",
    };
  }
}

export async function LoginUserAction(formData) {
  await connectToDB();
  try {
    const { email, password } = formData;

    // check if user exist in db
    const checkUser = await User.findOne({ email }); // will get the entire user data through email
    if (!checkUser) {
      return {
        success: false,
        message: "User doesn't exist, Please sign up",
      };
    }

    // check if password is valid or not
    const checkPassword = await bcryptjs.compare(password, checkUser.password);
    if (!checkPassword) {
      return {
        success: false,
        message: "Password incorrent, Try again",
      };
    }

    const createTokenData = {
      id: checkUser._id,
      userName: checkUser.userName,
      email: checkUser.email,
    };

    const token = jwt.sign(createTokenData, "DEFAULT_KEY", { expiresIn: "1d" });

    const getCookies = await cookies();
    getCookies.set("token", token);

    return {
      success: true,
      message: "Login Successfull",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong, Please try again.",
    };
  }
}

export async function fetchAuthUserAction() {
  await connectToDB();
  try {
    const getCookies = await cookies();
    const token = getCookies.get("token")?.value || "";
    if (token === "") {
      return {
        sucess: false,
        message: "Token in invalid",
      };
    }

    const decodedToken = jwt.verify(token, "DEFAULT_KEY"); // THIS WILL GIVE THE DATA OF createTokenData
    const getUserInfo = await User.findOne({ _id: decodedToken.id });

    if (getUserInfo) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(getUserInfo)),
      };
    } else {
      return {
        sucess: false,
        message: "Something went wrong! Please Try again.",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      sucess: false,
      message: "Something went wrong! Please Try again.",
    };
  }
}

export async function logOutAction() {
  const getCookies = await cookies();
  getCookies.set("token", "");
  if (getCookies === "") {
    return NextResponse.redirect("/sign-in");
  }
}
