from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from ..database import get_db
from ..models import Article
from ..auth import get_current_user

router = APIRouter(prefix="/article", tags=["articles"])

class ArticleCreate(BaseModel):
    article_id: str
    title: str
    content: str
    status: str = "draft"
    metadata: dict = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[str] = None
    metadata: Optional[dict] = None

class ArticleResponse(BaseModel):
    article_id: str
    title: str
    content: str
    status: str
    metadata: dict
    created_at: datetime
    updated_at: datetime

@router.get("/list", response_model=List[ArticleResponse])
async def list_articles(db=Depends(get_db)):
    """Get list of all articles"""
    articles = await db["articles"].find({}).sort("updated_at", -1).to_list(length=100)
    return articles

@router.post("/submit", response_model=ArticleResponse)
async def submit_article(
    article: ArticleCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Submit a new article or update an existing one"""
    article_data = article.dict()
    
    if not article_data["article_id"] or not article_data["content"]:
        raise HTTPException(status_code=400, detail="Article ID and content are required")

    # Add metadata if not provided
    if not article_data.get("metadata"):
        article_data["metadata"] = {}

    # Add timestamps
    now = datetime.utcnow()
    article_data["created_at"] = now
    article_data["updated_at"] = now
    article_data["author"] = current_user.email

    # Update or insert
    result = await db["articles"].update_one(
        {"article_id": article_data["article_id"]},
        {"$set": article_data},
        upsert=True
    )

    if result.upserted_id:
        article_data["_id"] = result.upserted_id

    return article_data

@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(
    article_id: str,
    db=Depends(get_db)
):
    """Get a specific article by ID"""
    article = await db["articles"].find_one({"article_id": article_id})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: str,
    article: ArticleUpdate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Update an existing article"""
    article_data = article.dict(exclude_unset=True)
    
    if not article_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Update timestamps
    article_data["updated_at"] = datetime.utcnow()

    result = await db["articles"].update_one(
        {"article_id": article_id},
        {"$set": article_data}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")

    updated_article = await db["articles"].find_one({"article_id": article_id})
    return updated_article

@router.delete("/{article_id}")
async def delete_article(
    article_id: str,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Delete an article"""
    result = await db["articles"].delete_one({"article_id": article_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")

    return {"message": "Article deleted successfully"}
