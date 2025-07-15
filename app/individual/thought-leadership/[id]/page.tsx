"use client";
 
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import { marked } from "marked";
 
const ArticlePage = () => {
  const { id } = useParams();
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!id) return;
 
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/article/${id}`);
        const data = await res.json();
        const markdown = data.sections?.[0]?.content || "";
        const html = await marked.parse(markdown);
        setHtmlContent(html);
      } catch (error) {
        console.error("Error fetching content:", error);
        setHtmlContent("<p>Error loading article.</p>");
      } finally {
        setLoading(false);
      }
    };
 
    fetchArticle();
  }, [id]);
 
  return (
    <div className="max-w-3xl mx-auto p-6">
      {loading ? (
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-2" />
          Loading...
        </div>
      ) : (
        <div
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </div>
  );
};
 
export default ArticlePage;
 
 