import { IncomingForm } from "formidable";
import fs from "fs";
import { MongoClient } from "mongodb";

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Failed to parse form" });
    }

    // const { article_id, title, content, status } = fields;
    const article_id = String(fields.article_id).trim();
    const title = fields.title;
    const content = fields.content;
    const status = fields.status;

    const imageFile = files.image;

    const client = await MongoClient.connect(
      process.env.MONGO_URI || "mongodb+srv://checkmain32:Kishore123@cluster0.jdacyq4.mongodb.net/admin?retryWrites=true&w=majority&appName=Cluster0/"
    );
    const db = client.db(process.env.MONGO_DB_NAME || "data");
    const collection = db.collection("submitted_articles");

    const imageBase64 = imageFile
      ? fs.readFileSync(imageFile.filepath, { encoding: "base64" })
      : null;

    await collection.updateOne(
      { article_id },
      {
        $set: {
          article_id,
          title,
          content,
          status,
          image: imageBase64, // optional
        },
      },
      { upsert: true }
    );

    client.close();

    return res.status(200).json({ success: true });
  });
}
