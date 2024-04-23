import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`mongodb is connected : and host on || ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("error : Data base error => " , error);
        
    }
}


export default connectDB;

