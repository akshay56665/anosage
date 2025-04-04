import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request:Request) {
    await dbConnect()
    const {username,content}=await request.json()
    try {
        const user=await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:401})
        }
        if(!user.isAcceptMessage){
            return Response.json({
                success:false,
                message:"User is not accepting messsges"
            },{status:402})
        }
        const message={content:content,createdAt:new Date()}
        user.message.push(message as Message)
        await user.save()
        return Response.json({
            success:true,
            message:"messsge sent successfully"
        },{status:200})
        
    } catch (error) {
        return Response.json({
            success:false,
            message:"Internal server error"
        },{status:500})
    }
}