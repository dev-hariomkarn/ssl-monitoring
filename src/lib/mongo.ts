// lib/mongo.js
// import mongoose from 'mongoose';

// const MONGO_URI = process.env.MONGO_URI!;

// export const connectToDB = async () => {
//   if (mongoose.connections[0].readyState) return;
//   await mongoose.connect(MONGO_URI, {
//     useUnifiedTopology: true,
//   });
// };



import mongoose from "mongoose"

export const connectToDB = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGO_URI!)
            const connection = await mongoose.connection
            connection.on('connected', () => {
                console.log("monogDB Connected")
            })
            connection.on('error', (err) => {
                console.log("Mongo after connection error: ", err)
                process.exit()
            })
        } catch (error) {
            console.log("db connection error", error)
        }
    }
}