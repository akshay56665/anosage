'use client'
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger,} from "@/components/ui/alert-dialog"
import {Message} from '@/models/User'
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios  from 'axios'
import {ApiResponse} from '@/types/ApiResponse'

type MessageCardProps={
    message:Message,
    onMessageDelete:(messageId:string)=>void
}

const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
    const {toast}=useToast()
    const handleDelete=async ()=>{
        const response=await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title:response.data.message
        })
        // onMessageDelete(message._id)
    }
  return (
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant='destructive'><X className="w-5 h-5"/></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Card Content</p>
        </CardContent>
        <CardFooter>
            <p>Card Footer</p>
        </CardFooter>
        </Card>

  )
}

export default MessageCard
