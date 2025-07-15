"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Award, 
  Code, 
  Users, 
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle,
  ChevronRight,
  Download,
  MapPin,
  Plus,
  TrendingUp,
  BookOpen,
  Briefcase,
  Target,
  User as UserIcon,
  Settings
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ReadinessReport() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reportData, setReportData] = useState({
    evaluation: {
      skill_pathway: [],
      recommendations: [],
      gap_analysis: []
    },
    scores: {
      profile_score: 0,
      technical_skills_score: 0,
      soft_skills_score: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailedRecommendations, setShowDetailedRecommendations] = useState(false);

  const sidebarItems = [
    { title: "Dashboard", href: "/individual/dashboard", icon: TrendingUp },
    { title: "Profile Builder", href: "/individual/profile", icon: UserIcon },
    { title: "Skills & Experience", href: "/individual/skills", icon: Target },
    { title: "Assessments", href: "/individual/assessments", icon: BookOpen },
    { title: "Readiness Report", href: "/individual/readiness-report", icon: TrendingUp, active: true },
    { title: "Settings", href: "/individual/settings", icon: Settings },
  ];

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const email = searchParams.get('email');
        
        // Mock data with the provided scores
        const mockData = {
          scores: {
            profile_score: 4.9,
            qualification_score: 3.8,
            skill_score: 5.0,
            soft_skills_score: 4.6
          },
          evaluation: {
            gap_analysis: {
              strengths: [
                'Excellent technical skills with a perfect score',
                'Strong profile and soft skills',
                'Well-balanced skill set'
              ],
              weaknesses: [
                'Could enhance qualifications further',
                'Consider additional certifications',
                'Expand professional network'
              ]
            },
            recommendations: [
              {
                name: 'Advanced Certifications',
                description: 'Pursue advanced certifications in your field to enhance your expertise and marketability.'
              },
              {
                name: 'Leadership Development',
                description: 'Mentor others to enhance leadership skills and build a strong professional network.'
              },
              {
                name: 'Industry Engagement',
                description: 'Attend industry conferences and workshops to stay updated with the latest trends and network with professionals.'
              }
            ],
            skill_pathway: [
              'Master advanced concepts in your field',
              'Develop specialized expertise',
              'Enhance leadership and management skills',
              'Build a professional network'
            ]
          }
        };

        // For testing, we'll use mock data directly
        console.log('Using mock data for scores:', mockData);
        setReportData(mockData);
        
        // Uncomment this to enable API call when ready
        /*
        if (email) {
          const response = await fetch('http://192.168.0.207:5000/api/generate_scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            // Ensure the response has the expected structure
            if (data.scores) {
              setReportData(data);
            } else {
              console.warn('Unexpected API response format, using mock data');
              setReportData(mockData);
            }
          } else {
            console.warn('API error, using mock data');
            setReportData(mockData);
          }
        } else {
          console.log('No email provided, using mock data');
          setReportData(mockData);
        }
        */
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load report data. Using sample data instead.');
        // Set mock data on error
        setReportData({
          scores: {
            profile_score: 4.9,
            qualification_score: 3.8,
            skill_score: 5.0,
            soft_skills_score: 4.6
          },
          evaluation: {
            gap_analysis: {
              strengths: [],
              weaknesses: []
            },
            recommendations: [],
            skill_pathway: []
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [searchParams])

  if (isLoading) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="individual"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="individual"
      >
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Report</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  if (!reportData) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="individual"
      >
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Report Data Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't find any report data for this profile.</p>
          <Button onClick={() => router.push('/individual/profile')}>
            Back to Profile
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  // Get user data from localStorage or context
  const [userData, setUserData] = useState({ name: 'User', email: '' })
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        setUserData({
          name: user?.name || 'User',
          email: user?.email || ''
        })
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName={userData.name}
      userEmail={userData.email}
    >
      <div className="w-full min-h-full">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 px-6 sm:px-8 md:px-12 rounded-xl shadow-lg mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Readiness Report</h1>
                <p className="mt-2 text-blue-100 max-w-3xl">
                  Comprehensive analysis of your skills, strengths, and areas for improvement
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>z
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        {/* Summary Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Executive Summary</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This report provides a comprehensive analysis of your current skill profile, highlighting strengths, 
                areas for improvement, and personalized recommendations to enhance your professional readiness.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Key Highlights</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Strong technical skills with a perfect score of {reportData?.scores?.skill_score || '5.0'}/5.0
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Well-balanced profile across all assessment categories
                      </span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Opportunities to enhance qualifications and certifications
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Next Steps</h4>
                  <ol className="space-y-2">
                    <li className="flex items-start">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium mr-2 flex-shrink-0">1</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Review your skill gap analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium mr-2 flex-shrink-0">2</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Explore personalized recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium mr-2 flex-shrink-0">3</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Start with the suggested learning path</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-600 dark:text-blue-400">Overall Score</CardDescription>
              <CardTitle className="text-3xl">
                {reportData?.scores?.overall_score ? reportData.scores.overall_score.toFixed(1) : 'N/A'}
                <span className="text-base text-gray-500 ml-1">/ 5.0</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  style={{ width: `${(reportData?.scores?.overall_score || 0) * 20}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-600 dark:text-green-400">Technical Skills</CardDescription>
              <CardTitle className="text-3xl">
                {reportData?.scores?.skill_score ? reportData.scores.skill_score.toFixed(1) : 'N/A'}
                <span className="text-base text-gray-500 ml-1">/ 5.0</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                  style={{ width: `${(reportData?.scores?.skill_score || 0) * 20}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-purple-600 dark:text-purple-400">Soft Skills</CardDescription>
              <CardTitle className="text-3xl">
                {reportData?.scores?.soft_skills_score ? reportData.scores.soft_skills_score.toFixed(1) : 'N/A'}
                <span className="text-base text-gray-500 ml-1">/ 5.0</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full bg-purple-100 dark:purple-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                  style={{ width: `${(reportData?.scores?.soft_skills_score || 0) * 20}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-amber-600 dark:text-amber-400">Qualifications</CardDescription>
              <CardTitle className="text-3xl">
                {reportData?.scores?.qualification_score ? reportData.scores.qualification_score.toFixed(1) : 'N/A'}
                <span className="text-base text-gray-500 ml-1">/ 5.0</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                  style={{ width: `${(reportData?.scores?.qualification_score || 0) * 20}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scores Overview */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Your Scores</CardTitle>
            <CardDescription>Overview of your profile assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Profile Score */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Profile Score</p>
                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-200 mt-1">
                      {reportData?.scores?.profile_score !== undefined ? reportData.scores.profile_score.toFixed(1) : 'N/A'}<span className="text-lg text-gray-500">/5.0</span>
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <Progress 
                  value={(reportData?.scores?.profile_score || 0) * 20} 
                  className="h-2 mt-4 bg-blue-100 dark:bg-blue-900/30" 
                  indicatorClassName="bg-blue-500" 
                />
              </div>

              {/* Qualification Score */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Qualification</p>
                    <p className="text-3xl font-bold text-purple-800 dark:text-purple-200 mt-1">
                      {reportData?.scores?.qualification_score !== undefined ? reportData.scores.qualification_score.toFixed(1) : 'N/A'}<span className="text-lg text-gray-500">/5.0</span>
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <Progress 
                  value={(reportData?.scores?.qualification_score || 0) * 20} 
                  className="h-2 mt-4 bg-purple-100 dark:bg-purple-900/30" 
                  indicatorClassName="bg-purple-500" 
                />
              </div>

              {/* Technical Skills Score */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-6 rounded-lg border border-green-100 dark:border-green-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Technical Skills</p>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-200 mt-1">
                      {reportData?.scores?.skill_score !== undefined ? reportData.scores.skill_score.toFixed(1) : 'N/A'}<span className="text-lg text-gray-500">/5.0</span>
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <Progress 
                  value={(reportData?.scores?.skill_score || 0) * 20} 
                  className="h-2 mt-4 bg-green-100 dark:bg-green-900/30" 
                  indicatorClassName="bg-green-500" 
                />
              </div>

              {/* Soft Skills Score */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 p-6 rounded-lg border border-amber-100 dark:border-amber-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Soft Skills</p>
                    <p className="text-3xl font-bold text-amber-800 dark:text-amber-200 mt-1">
                      {reportData?.scores?.soft_skills_score !== undefined ? reportData.scores.soft_skills_score.toFixed(1) : 'N/A'}<span className="text-lg text-gray-500">/5.0</span>
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <Progress 
                  value={(reportData?.scores?.soft_skills_score || 0) * 20} 
                  className="h-2 mt-4 bg-amber-100 dark:bg-amber-900/30" 
                  indicatorClassName="bg-amber-500" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gap Analysis */}
        {reportData?.evaluation?.gap_analysis && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Gap Analysis</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Export Data
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="space-y-6">
                  {reportData?.gap_analysis?.map((gap, index) => (
                    <div key={index} className="pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0 last:mb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{gap.area}</h3>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            gap.severity === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            gap.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {gap.severity} Priority
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{gap.description}</p>
                      
                      {gap.suggestions && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommended Actions</h4>
                          <ul className="space-y-2">
                            {gap.suggestions.map((suggestion, i) => (
                              <li key={i} className="flex items-start">
                                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2 mt-0.5">
                                  <Lightbulb className="h-3 w-3" />
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recommendations */}
        {reportData?.evaluation?.recommendations?.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personalized Recommendations</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <SortAsc className="h-3.5 w-3.5 mr-1.5" />
                  Sort
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {reportData?.recommendations?.map((rec, index) => {
                // Handle both string and object formats for recommendations
                let recName, recDescription, recPriority, recCategory;
                if (typeof rec === 'string') {
                  recName = rec;
                  recDescription = '';
                  recPriority = 'medium';
                  recCategory = 'General';
                } else if (rec && typeof rec === 'object') {
                  recName = rec.name || rec.title || 'Recommendation';
                  recDescription = rec.description || '';
                  recPriority = rec.priority?.toLowerCase() || 'medium';
                  recCategory = rec.category || 'General';
                } else {
                  recName = String(rec);
                  recDescription = '';
                  recPriority = 'medium';
                  recCategory = 'General';
                }
                
                const priorityColors = {
                  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                };
                
                const categoryColors = {
                  skill: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                  certification: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
                  experience: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
                  general: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                };
                
                return (
                  <div key={index} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[recCategory.toLowerCase()] || categoryColors.general}`}>
                              {recCategory}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[recPriority] || priorityColors.medium}`}>
                              {recPriority.charAt(0).toUpperCase() + recPriority.slice(1)} Priority
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {recName}
                          </h3>
                          {recDescription && (
                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                              {recDescription}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Bookmark className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Skill Development Pathway */}
        {reportData?.evaluation?.skill_pathway?.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Development Pathway</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Your personalized learning journey to career readiness
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="hidden sm:flex items-center"
              >
                <MapPin className="h-4 w-4 mr-2" />
                View Full Learning Path
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="space-y-8">
                  {reportData.evaluation.skill_pathway.map((skill, index) => {
                    let skillText = '';
                    let description = '';
                    const isCompleted = index < 1; // First item is completed by default
                    
                    // Handle different skill item formats
                    if (typeof skill === 'string') {
                      skillText = skill;
                    } else if (skill && typeof skill === 'object') {
                      if (skill.title || skill.name) {
                        skillText = skill.title || skill.name;
                        if (skill.description) {
                          description = skill.description;
                        }
                      } else if ('from_skill' in skill && 'to_skill' in skill) {
                        skillText = `Progress from ${skill.from_skill}`;
                        description = `Advance to: ${skill.to_skill}`;
                      } else if ('skill' in skill) {
                        skillText = skill.skill || 'Skill';
                        if (skill.next_steps) {
                          description = Array.isArray(skill.next_steps) 
                            ? skill.next_steps.join(' • ') 
                            : String(skill.next_steps || '');
                        } else if ('next_step' in skill) {
                          // Handle case where the key is next_step instead of next_steps
                          description = skill.next_step ? String(skill.next_step) : '';
                        }
                      } else if ('current_skill' in skill || 'next_skill' in skill) {
                        skillText = skill.current_skill || skill.next_skill || 'Next Skill';
                        if (skill.sequence) {
                          description = `Step ${skill.sequence} in learning path`;
                        }
                      }
                      
                      if (skillText === '' && Object.keys(skill).length > 0) {
                        console.warn('Unexpected skill object format. Available keys:', Object.keys(skill));
                      }
                    } else if (skill !== null && skill !== undefined) {
                      skillText = String(skill);
                    }
                    
                    return (
                      <div 
                        key={index} 
                        className={`relative pl-10 pb-8 ${index < reportData.evaluation.skill_pathway.length - 1 ? 'border-l-2 border-gray-200 dark:border-gray-700' : ''}`}
                      >
                        {/* Timeline dot */}
                        <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center -ml-3 ${
                          isCompleted 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 ring-4 ring-white dark:ring-gray-800' 
                            : 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 text-gray-400 dark:text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className={`p-4 rounded-lg ${
                          isCompleted 
                            ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20' 
                            : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1">
                              <h3 className={`text-lg font-medium ${
                                isCompleted 
                                  ? 'text-green-800 dark:text-green-200' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {skillText || 'Skill Development'}
                              </h3>
                              
                              {description && (
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  {description}
                                </p>
                              )}
                              
                              {!isCompleted && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {index === 0 ? 'Next Up' : `Step ${index + 1}`}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                    ~{Math.ceil(Math.random() * 4) + 2} weeks
                                  </Badge>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-shrink-0 flex items-center space-x-2">
                              {isCompleted ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Completed
                                </span>
                              ) : (
                                <>
                                  <Button variant="outline" size="sm" className="text-xs">
                                    <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                                    Save
                                  </Button>
                                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs">
                                    {index === 0 ? 'Start Now' : 'View Details'}
                                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <Button variant="outline" className="w-full border-dashed hover:border-gray-300 dark:hover:border-gray-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Learning Goal
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800 mt-8">
          <Button onClick={() => window.print()} className="mr-2">
            Print Report
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
