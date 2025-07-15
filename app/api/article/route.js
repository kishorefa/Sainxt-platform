import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.text();
    const response = await fetch(`http://localhost:5000/api/article/submit/`, {
      method: 'POST',
      headers: request.headers,
      body
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit article' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('article_id');
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`http://localhost:5000/api/article/${articleId}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('article_id');
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const body = await request.text();
    const response = await fetch(`http://localhost:5000/api/article/update-content/${articleId}`, {
      method: 'PUT',
      headers: request.headers,
      body
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to update article content' },
      { status: 500 }
    );
  }
}
