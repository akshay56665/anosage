import { SendVerificationEmail } from "@/helper/SendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  dbConnect();
  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    const verify = Math.floor(100000 * Math.random() + 900000).toString();

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "User already exists with this username",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verify;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verify,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptMessage: true,
        message: [],
      });
      await user.save();
    }

    const emailVerifiction = await SendVerificationEmail(
      email,
      username,
      verify
    );
    if (!emailVerifiction.success) {
      return Response.json(
        {
          success: false,
          message: emailVerifiction.message,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
