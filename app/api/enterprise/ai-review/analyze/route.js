export async function POST(request) {
  try {
    const { job_description, interview_responses } = await request.json();

    if (
      !job_description ||
      !interview_responses ||
      !Array.isArray(interview_responses)
    ) {
      return new Response(
        JSON.stringify({
          error: "Job description and interview responses are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Call the Flask backend for AI analysis
    const flaskResponse = await fetch("http://192.168.0.207:5000/api/ai_review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_description,
        interview_responses,
      }),
    });

    const data = await flaskResponse.json();

    if (!flaskResponse.ok) {
      return new Response(
        JSON.stringify({
          error: data.error || "Failed to generate AI review",
        }),
        {
          status: flaskResponse.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in AI review analysis:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred during AI review",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
