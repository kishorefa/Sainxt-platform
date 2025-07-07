import { MongoClient } from 'mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    // Find the most recent interview response for this email
    const userData = await db.collection('interview_responses')
      .findOne(
        { username: email },
        { sort: { _id: -1 } } // Get the most recent entry
      );

    await client.close();

    if (!userData) {
      return new Response(JSON.stringify({ 
        error: 'No interview responses found for this email' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formattedResponses = userData.responses.map(response => ({
      question: response.question || '',
      answer: response.answer || 'No answer provided'
    }));

    return new Response(JSON.stringify({
      responses: formattedResponses,
      job_description: userData.job_description || 'No job description available'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching interview responses:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch interview responses',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
