import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"

export async function POST(request:Request){
    await dbConnect()
    try {
        const {username,code}=await request.json()
        const decodeUsername=decodeURIComponent(username)
        const user=await UserModel.findOne({username:decodeUsername})

        if(!user){
            return Response.json({
                success:false,
                message:"Error Verification user"
            },{status:400})
        }
        const isCodeValid=user.verifyCode===code
        const isCodeNotExpiry=new Date(user.verifyCodeExpiry)>new Date()
        if(isCodeValid&&isCodeNotExpiry){
            user.isVerified=true
            await user.save()

            return Response.json({
                success:true,
                message:"Account verified successfully"
            },{status:200})
        }
        else if(!isCodeNotExpiry){
            return Response.json({
                success:false,
                message:"Verification code expired. please signup again to get new code"
            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"Invalid verification code"
            },{status:400})
        }

    } catch (error) {
        console.error("Error verifying user: ",error)
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{status:404})
    }
}