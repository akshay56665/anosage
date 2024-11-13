import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request) {
    await dbConnect()
    const session=await getServerSession(authOptions)
    const user:User=session?.user as User

    if (!session||!session.user) {
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userid=new mongoose.Types.ObjectId(user._id)
    try {
        const user=await UserModel.aggregate([
            {$match:{id:userid}},
            {$unwind:"$messages"},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',message:{$push:'$messages'}}}
        ])

        if(!user||user.length===0){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:402})
        }
        console.log(user)
        return Response.json({
            success:true,
            messages:user[0].messages
        },{status:200})
    } catch (error) {
        return Response.json({
            success:false,
            message:"Unexpected error"
        },{status:500})
    }
}