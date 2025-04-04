import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import {z} from 'zod'
import {usernameValidation} from "@/schemas/signUpSchema"

const userQuerySchema=z.object({
    username:usernameValidation
})

export async function GET(request:Request){
    await dbConnect()
    try{
        const {searchParams}=new URL(request.url)
        const queryParams={
            username:searchParams.get("username")
        }
        // zod validation 
        const result=userQuerySchema.safeParse(queryParams)
        console.log("Result of username validation: ",result);
        
        if(!result.success){
            const errors=result.error.format().username?._errors||[]
            return Response.json({
                success:false,
                message:errors.length>0? errors.join(','):"Invalid Query parameters"
            },{status:400})
        }
        const {username}=result.data;
        const existingVerifiedUsername=await UserModel.findOne({username,isVerified:true})
        if(existingVerifiedUsername){
            return Response.json({
                success:false,
                message:"Username already taken"
            },{status:403}) 
        }
        return Response.json({
            success:true,
            message:"Username is unique"
        },{status:200})
    }
    catch(err){
        console.error("Error checking username: ",err)
        return Response.json({
            success:false,
            message:'Error checking username'
        },{status:500})
    }
}