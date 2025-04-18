import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import {NextAuthOptions} from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'

// login process using authnext
export const authOptions:NextAuthOptions = {
  providers:[
    CredentialsProvider({
      id:'credentials',
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password"}
      },
      async authorize(credentials:any):Promise<any> {
        await dbConnect()
        try {
          const user = await UserModel.findOne({
            $or :[
              {username:credentials.identifier},
              {email:credentials.identifier}
            ]
          })
          
          if (!user) {
            throw new Error("No user found with this email");
          }

          if(!user?.isVerified){
            throw new Error("Please verify your account before login")
          }


          const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
          if(!isPasswordCorrect){
            throw new Error("Incorrect password");
          }
          return user;
    
        } catch (err:any) {
          throw new Error(err)
        }
      }
    })
  ],
  callbacks:{
    async jwt({ token,user }) {
      if(user){
        token._id=user._id?.toString()
        token.isVerified=user.isVerified
        token.isAcceptingMessage=user.isAcceptingMessage
        token.username=user.username
      }
      return token
    },
    
    async session({ session, token }) {
      if(token){
        session.user._id=token._id?.toString()
        session.user.isVerified=token.isVerified
        session.user.isAcceptingMessage=token.isAcceptingMessage
        session.user.username=token.username
      }
      return session
    },
  },
  pages:{
    signIn:'/signin'
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET,
}