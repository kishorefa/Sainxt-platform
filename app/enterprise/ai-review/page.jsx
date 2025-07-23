'use client';

import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { 
  TrendingUp, 
  Briefcase, 
  Users, 
  Calendar, 
  UserCheck, 
  Building2, 
  Sparkles,
  Search,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

const sidebarItems = [
  { title: "Dashboard", href: "/enterprise/dashboard", icon: TrendingUp },
  { title: "Job Listings", href: "/enterprise/jobs", icon: Briefcase },
  { title: "Candidates", href: "/enterprise/candidates", icon: Users },
  { title: "Interviews", href: "/enterprise/interviews", icon: Calendar },
  { title: "Analytics", href: "/enterprise/analytics", icon: TrendingUp },
  { title: "JD Interview", href: "/enterprise/jd-interview", icon: UserCheck },
  { title: "AI Review", href: "/enterprise/ai-review", icon: Sparkles },
  { title: "Settings", href: "/enterprise/settings", icon: Building2 },
];

export default function AIReviewPage() {
  const [email, setEmail] = useState('');
  const [responses, setResponses] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiReview, setAiReview] = useState(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [error, setError] = useState('');
  const reportRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    setIsPdfLoading(true);
    setPdfError('');
    
    try {
      // Load required scripts
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      
      const { jsPDF } = window.jspdf;
      const element = reportRef.current;
      
      // Create a temporary element to clone the report
      const tempElement = element.cloneNode(true);
      
      // Remove the download button from the PDF
      const downloadBtn = tempElement.querySelector('#download-pdf-btn');
      if (downloadBtn) {
        downloadBtn.remove();
      }
      
      // Create a container for the PDF content
      const container = document.createElement('div');
      container.style.padding = '20px';
      container.style.backgroundColor = 'white';
      container.style.color = '#1f2937';
      container.style.width = '794px'; // A4 width in pixels at 96dpi
      
      // Add a title to the PDF
      const title = document.createElement('h1');
      title.textContent = 'AI Review Report';
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '20px';
      title.style.textAlign = 'center';
      title.style.color = '#1f2937';
      
      container.appendChild(title);
      container.appendChild(tempElement);
      
      // Add to body temporarily
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px';
      tempContainer.style.padding = '20px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.appendChild(container);
      document.body.appendChild(tempContainer);
      
      // Generate PDF using html2canvas and jsPDF
      const canvas = await window.html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        scrollY: -window.scrollY
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // 10mm margin on each side
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save(`AI_Review_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Clean up
      document.body.removeChild(tempContainer);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError('Failed to generate PDF. Please try again.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const getAssessmentBadgeClass = (assessment) => {
    if (!assessment) return 'text-gray-600 dark:text-gray-300';
    
    const assessmentLower = assessment.toLowerCase();
    if (assessmentLower.includes('excellent') || assessmentLower.includes('strong')) {
      return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
    } else if (assessmentLower.includes('good') || assessmentLower.includes('moderate')) {
      return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
    } else if (assessmentLower.includes('fair') || assessmentLower.includes('average')) {
      return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
    } else if (assessmentLower.includes('poor') || assessmentLower.includes('weak')) {
      return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
    }
    return 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
  };

  const getAssessmentDescription = (assessment) => {
    if (!assessment) return 'No assessment available';
    
    const assessmentLower = assessment.toLowerCase();
    if (assessmentLower.includes('excellent') || assessmentLower.includes('strong')) {
      return 'Exceptional match with the job requirements';
    } else if (assessmentLower.includes('good') || assessmentLower.includes('moderate')) {
      return 'Good alignment with the job requirements';
    } else if (assessmentLower.includes('fair') || assessmentLower.includes('average')) {
      return 'Meets some of the job requirements';
    } else if (assessmentLower.includes('poor') || assessmentLower.includes('weak')) {
      return 'Limited alignment with job requirements';
    }
    return 'Assessment details not available';
  };

  const fetchResponses = async () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setAiReview(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/report/responses/${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (response.ok) {
        // Transform the response to match the expected format
        const formattedResponses = data.responses || [];
        setResponses(formattedResponses);
        setJobDescription(data.job_description || 'No job description available');
      } else {
        setError(data.error || 'Failed to fetch responses');
        setResponses([]);
        setJobDescription('');
      }
    } catch (err) {
      setError('Failed to connect to the server');
      console.error('Error fetching responses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchResponses();
  };

  const handleAIReview = async () => {
    if (responses.length === 0) {
      setError('No responses available for review');
      return;
    }

    setIsReviewLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/report/ai_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_description: jobDescription,
          responses: responses.map(r => ({
            question: r.question,
            answer: r.answer
          }))
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Parse the response to match the expected format
        setAiReview({
          overall_score: data.overall_score || 'N/A',
          fit_assessment: data.fit_assessment || 'N/A',
          overall_report: data.overall_report || 'No analysis available'
        });
      } else {
        setError(data.error || 'Failed to generate AI review');
      }
    } catch (err) {
      setError('Failed to connect to the AI service');
      console.error('Error generating AI review:', err);
    } finally {
      setIsReviewLoading(false);
    }
  };

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="enterprise"
      userName="AI Review User"
      userEmail="ai-review@example.com"
    >
      <>

        {/* PDF Scripts */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
          crossOrigin="anonymous"
        />
        <div className="flex flex-col h-full p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">AI-Powered Interview Review</h1>
          <p className="text-muted-foreground">
            Enter candidate email to fetch and review interview responses
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Candidate Search</CardTitle>
            <CardDescription>
              Enter the candidate's email to fetch their interview responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter candidate's email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {(responses.length > 0 || aiReview) && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Interview Responses</CardTitle>
                  <Button 
                    onClick={handleAIReview} 
                    disabled={isReviewLoading || responses.length === 0}
                    variant="outline"
                    className="gap-2"
                  >
                    {isReviewLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        AI Review
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription>
                  {responses.length} question{responses.length !== 1 ? 's' : ''} answered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    {responses.map((response, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium">Q: {response.question}</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {response.answer || 'No answer provided'}
                        </p>
                        {index < responses.length - 1 && <hr className="my-4" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="relative">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>AI Review</CardTitle>
                    <CardDescription>
                      AI-generated analysis of the candidate's responses
                    </CardDescription>
                  </div>
                  {isClient && aiReview && !isPdfLoading && (
                    <Button 
                      id="download-pdf-btn"
                      onClick={handleDownloadPDF}
                      disabled={isPdfLoading}
                      variant="outline"
                      className="gap-2"
                    >
                      {isPdfLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download PDF
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent ref={reportRef}>
                {aiReview ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Overall Score */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Overall Score</h3>
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                          </div>
                        </div>
                        <div className="text-4xl font-bold text-blue-800 dark:text-blue-100">
                          {aiReview.overall_score || 'N/A'}
                          {aiReview.overall_score && <span className="text-sm font-normal text-blue-600 dark:text-blue-300 ml-1">/ 100</span>}
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-blue-200 dark:bg-blue-900/30 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, Math.max(0, parseInt(aiReview.overall_score) || 0))}%`,
                                transition: 'width 0.5s ease-in-out'
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fit Assessment */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border border-green-100 dark:border-green-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Fit Assessment</h3>
                          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-green-600 dark:text-green-300" />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={getAssessmentBadgeClass(aiReview.fit_assessment)}>
                            {aiReview.fit_assessment || 'N/A'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-green-600 dark:text-green-300">
                          {getAssessmentDescription(aiReview.fit_assessment)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Detailed Analysis</h3>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans">
                          {aiReview.overall_report || 'No analysis available'}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                    <p>Click "AI Review" to generate analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </>
    </DashboardLayout>
  );
}
