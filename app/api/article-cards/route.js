import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    console.log('Connecting to MongoDB...');
    const { db } = await connectToDatabase();
    
    if (!db) {
      throw new Error('Failed to connect to database');
    }

    console.log('Connected to database. Fetching article cards...');
    
    // First, check if the collection exists
    const collections = await db.listCollections({ name: 'article_cards' }).toArray();
    if (collections.length === 0) {
      console.log('article_cards collection does not exist');
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch only article_id and title fields from article_cards collection
    const articles = await db
      .collection('article_cards')
      .find({}, { projection: { article_id: 1, title: 1, _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`Fetched ${articles.length} article cards`);

    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in article-cards API route:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch article cards',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
