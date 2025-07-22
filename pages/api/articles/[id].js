// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export default async function handler(req, res) {
//   const { id } = req.query;

//   const { db } = await connectToDatabase();
//   const collection = db.collection("submitted_articles");

//   if (!ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid ID" });
//   }

//   const objectId = ObjectId.createFromHexString(id); // 👈 updated line

//   try {
//     switch (req.method) {
//       case "GET": {
//         const article = await collection.findOne({ _id: objectId });
//         if (!article)
//           return res.status(404).json({ message: "Article not found" });
//         return res.status(200).json({ article });
//       }

//       case "DELETE": {
//         const result = await collection.deleteOne({ _id: objectId });
//         if (result.deletedCount === 0)
//           return res
//             .status(404)
//             .json({ message: "Article not found or already deleted" });
//         return res.status(200).json({ message: "Deleted successfully" });
//       }

//       default:
//         return res.status(405).json({ message: "Method not allowed" });
//     }
//   } catch (error) {
//     console.error("API error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }
