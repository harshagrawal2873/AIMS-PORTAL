import { connectDB } from "@/utils/db";
import Batch from "@/models/Batch";

export async function GET(req){
    await connectDB();
    const batch = await Batch.find({});
    return Response.json({ success: true, batch});
}

export async function POST(req){
    try{
        await connectDB();
        const {batch, branch, facultyAdvisor} = await req.json();
        const newBatch = new Batch({batch, branch, facultyAdvisor})
        await newBatch.save();
        return Response.json({ success: true, newBatch: newBatch });
    }catch(error){
        return Response.json({ success: false, error: error.message }, { status: 400 });
    }
}