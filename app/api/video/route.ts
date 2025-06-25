import Video, { IVideo } from "@/models/Video";
import dbConnect from "@/lib/DBconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { transform } from "next/dist/build/swc/generated-native";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return Response.json({ error: "No videos found" }, { status: 404 });
    }
    return Response.json({ videos });
  } catch (error) {
    return Response.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}


export async function POST(request: Request) {
    try{
        const session = await getServerSession(authOptions)
        if(!session){
            return Response.json({ error: "Unauthorized access" }, { status: 401 });
        }
        await dbConnect();
        const body:IVideo = await request.json();
        if(!body.title || !body.description || !body.videoUrl || !body.thumbnailurl){
            return Response.json({ error: "All fields are required" }, { status: 400 });
        }

        const videoData = {
            ...body,
            controls : body?.controls ?? true,
            transformation :{
                width: 1920,
                height: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }
        const newVideo = await Video.create(videoData);
        return Response.json({ message: "Video created successfully", newVideo }, { status: 201 });
        
    }
    catch(error){
        return Response.json({ error: "Failed to create video" }, { status: 500 });
    }
}