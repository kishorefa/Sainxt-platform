import { NextResponse } from "next/server";

// ✅ Fix: Await the context parameter destructuring
// export async function GET(request, context) {
//   const { params } = context;
//   const articleId = params.id;

export async function GET(request, { params }) {
  const articleId = params.id;
  const catchAll = params.nextauth;

  if (!articleId) {
    return NextResponse.json(
      { error: "Article ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/article/${articleId}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  const { params } = context;
  const articleId = params.id;

  if (!articleId) {
    return NextResponse.json(
      { error: "Article ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.text();
    const response = await fetch(
      `http://localhost:5000/api/article/update-content/${articleId}`,
      {
        method: "PUT",
        headers: Object.fromEntries(request.headers), // 🛠 Convert headers to a plain object
        body,
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to update article content" },
      { status: 500 }
    );
  }
}
