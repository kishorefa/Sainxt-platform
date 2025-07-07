'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Filter, MapPin, Briefcase, DollarSign, Clock, Star, Sparkles, Brain, BrainCircuit, GraduationCap, BookOpen, Target, Award, Video, X, RefreshCw, Cpu, Database, BarChart2, Code, Zap, Server, Layers, Shield, Cloud, GitBranch, CpuIcon, Bot, Network, MessageSquare, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/jobs/JobCard';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: Sparkles },
  { title: "Profile Builder", href: "/individual/profile", icon: BookOpen },
  { title: "AI101", href: "/individual/introductory-training", icon: BookOpen },
  { title: "Thought Leadership", href: "/individual/thought-leadership", icon: BookOpen },
  { title: "AI Jobs", href: "/individual/jobs", icon: BrainCircuit, active: true },
];

// AI/ML focused job data with diverse experience levels
const jobsData = [
  // Fresher Roles (0-1 years)
  {
    id: 1,
    title: 'AI/ML Engineer - Fresher',
    company: 'TechInnovate',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹6L - ₹10L',
    match: 95,
    skills: ['Python', 'Machine Learning', 'Data Structures', 'Algorithms', 'NumPy', 'Pandas'],
    posted: '2 days ago',
    aiFocus: ['Machine Learning', 'Data Science', 'AI Fundamentals'],
    experience: '0-1 years',
    experienceLevel: 'fresher',
    logo: '/images/techinnovate.png',
    isRemote: true,
    isFeatured: true,
    description: 'Great opportunity for fresh graduates to kickstart their career in AI/ML. Training will be provided.'
  },
  {
    id: 2,
    title: 'AI Research Intern',
    company: 'DeepMind AI',
    location: 'Remote',
    type: 'Internship',
    salary: 'Stipend: ₹40,000 - ₹60,000/month',
    match: 92,
    skills: ['Python', 'Machine Learning', 'Research', 'TensorFlow', 'PyTorch'],
    posted: '1 week ago',
    aiFocus: ['Deep Learning', 'Research', 'Neural Networks'],
    experience: '0-1 years',
    experienceLevel: 'fresher',
    logo: '/images/deepmind.png',
    isRemote: true,
    isFeatured: true
  },
  
  // Experienced Roles (3+ years)
  {
    id: 3,
    title: 'Senior ML Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    salary: '$200,000 - $300,000',
    match: 88,
    skills: ['Machine Learning', 'Python', 'Deep Learning', 'LLMs', 'Distributed Systems'],
    posted: '3 days ago',
    aiFocus: ['NLP', 'Large Language Models', 'Generative AI'],
    experience: '5+ years',
    experienceLevel: 'experienced',
    logo: '/images/openai.png',
    isRemote: true,
    isFeatured: true
  },
  {
    id: 4,
    title: 'Computer Vision Lead',
    company: 'Tesla AI',
    location: 'Palo Alto, CA',
    type: 'Full-time',
    salary: '$220,000 - $320,000',
    match: 90,
    skills: ['Computer Vision', 'Deep Learning', 'Python', 'OpenCV', 'Autonomous Vehicles'],
    posted: '5 days ago',
    aiFocus: ['Computer Vision', 'Autonomous Systems'],
    experience: '7+ years',
    experienceLevel: 'experienced',
    logo: '/images/tesla.png',
    isFeatured: true
  },
  
  // Mid-Level Roles (1-3 years)
  {
    id: 5,
    title: 'ML Engineer',
    company: 'Cohere',
    location: 'Remote',
    type: 'Full-time',
    salary: '₹18L - ₹35L',
    match: 87,
    skills: ['Python', 'Machine Learning', 'NLP', 'Transformers', 'MLOps'],
    posted: '1 week ago',
    aiFocus: ['NLP', 'Large Language Models'],
    experience: '2-4 years',
    experienceLevel: 'mid-level',
    logo: '/images/cohere.png',
    isRemote: true
  },
  
  // More Fresher Roles
  {
    id: 6,
    title: 'AI/ML Trainee',
    company: 'AI Forge',
    location: 'Hyderabad, India',
    type: 'Full-time',
    salary: '₹4L - ₹8L',
    match: 93,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
    posted: '3 days ago',
    aiFocus: ['Machine Learning', 'Data Science'],
    experience: '0-1 years',
    experienceLevel: 'fresher',
    logo: '/images/aiforge.png',
    description: 'No prior experience required. We provide comprehensive training in AI/ML technologies.'
  },
  
  // More Experienced Roles
  {
    id: 7,
    title: 'AI Solutions Architect',
    company: 'NVIDIA',
    location: 'Bangalore, India / Remote',
    type: 'Full-time',
    salary: '₹45L - ₹80L',
    match: 89,
    skills: ['AI Architecture', 'Deep Learning', 'Cloud AI', 'MLOps', 'Kubernetes'],
    posted: '1 week ago',
    aiFocus: ['AI Infrastructure', 'ML Systems', 'Cloud AI'],
    experience: '8+ years',
    experienceLevel: 'experienced',
    logo: '/images/nvidia.png',
    isRemote: true,
    isFeatured: true
  },
  
  // Internship Roles
  {
    id: 8,
    title: 'ML Research Intern',
    company: 'Microsoft Research',
    location: 'Bangalore, India',
    type: 'Internship',
    salary: 'Stipend: ₹80,000 - ₹1,20,000/month',
    match: 94,
    skills: ['Research', 'Machine Learning', 'Python', 'PyTorch'],
    posted: '4 days ago',
    aiFocus: ['Machine Learning', 'Research'],
    experience: '0-1 years',
    experienceLevel: 'internship',
    logo: '/images/microsoft.png',
    description: 'Ideal for students pursuing PhD or Masters in CS with focus on ML/AI.'
  }
];

// AI Specializations
const aiSpecializations = [
  { id: 'all', name: 'All AI Jobs', icon: Cpu },
  { id: 'ml', name: 'Machine Learning', icon: BrainCircuit },
  { id: 'dl', name: 'Deep Learning', icon: Network },
  { id: 'nlp', name: 'NLP', icon: MessageSquare },
  { id: 'cv', name: 'Computer Vision', icon: Eye },
  { id: 'robotics', name: 'Robotics', icon: CpuIcon },
  { id: 'mlops', name: 'MLOps', icon: Server },
  { id: 'ai-research', name: 'AI Research', icon: Search },
];

// Trending AI Skills
const trendingSkills = [
  { name: 'LLMs', count: 1243 },
  { name: 'Transformers', count: 987 },
  { name: 'Diffusion Models', count: 765 },
  { name: 'Reinforcement Learning', count: 654 },
  { name: 'Generative AI', count: 543 },
  { name: 'Computer Vision', count: 987 },
  { name: 'NLP', count: 876 },
  { name: 'TensorFlow', count: 765 },
  { name: 'PyTorch', count: 876 },
  { name: 'MLOps', count: 543 },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [activeSpecialization, setActiveSpecialization] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Experience level options
  const experienceLevels = [
    { id: 'all', label: 'All Levels' },
    { id: 'fresher', label: 'Fresher (0-2 years)' },
    { id: 'internship', label: 'Internship' },
    { id: 'mid-level', label: 'Mid-Level (2-5 years)' },
    { id: 'experienced', label: 'Experienced (5+ years)' },
  ];

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         ) ||
                         job.aiFocus.some(focus =>
                           focus.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesLocation = !locationFilter || 
                          job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesJobType = !jobTypeFilter || job.type === jobTypeFilter;
    const matchesSpecialization = activeSpecialization === 'all' || 
                                job.aiFocus.some(focus => 
                                  focus.toLowerCase().includes(activeSpecialization)
                                );
    const matchesExperience = experienceFilter === 'all' || 
                            (job.experienceLevel === experienceFilter) ||
                            (experienceFilter === 'fresher' && job.experienceLevel === 'internship');
    
    return matchesSearch && matchesLocation && matchesJobType && matchesSpecialization && matchesExperience;
  });

  const { data: session } = useSession();
  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName={userName}
      userEmail={userEmail}
      className="!p-0 bg-gradient-to-b from-deep-navy/5 to-white"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-deep-navy to-indigo-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/ai-pattern.png')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-coral to-aqua-blue">
              AI & ML Career Opportunities
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover cutting-edge AI and Machine Learning roles at top tech companies worldwide.
              Your dream job in artificial intelligence is just a search away.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-1 shadow-xl">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white/70" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Job title, company, or AI specialization"
                    className="pl-10 h-14 text-lg bg-white/5 border-0 text-white placeholder-white/70 focus-visible:ring-2 focus-visible:ring-white/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  className="h-14 px-8 text-lg bg-gradient-to-r from-neon-coral to-aqua-blue hover:from-neon-coral/90 hover:to-aqua-blue/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  onClick={() => {}}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* AI Specializations */}
            <div className="bg-white rounded-2xl shadow-enterprise p-6 border border-soft-gray">
              <h3 className="font-semibold text-lg text-deep-navy mb-4 flex items-center">
                <BrainCircuit className="h-5 w-5 mr-2 text-neon-coral" />
                AI Specializations
              </h3>
              <div className="space-y-2">
                {aiSpecializations.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setActiveSpecialization(spec.id === 'all' ? 'all' : spec.name.toLowerCase())}
                    className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-all ${
                      (activeSpecialization === 'all' && spec.id === 'all') || 
                      (spec.id !== 'all' && activeSpecialization === spec.name.toLowerCase())
                        ? 'bg-gradient-to-r from-neon-coral/5 to-aqua-blue/5 border border-neon-coral/20 text-neon-coral font-medium'
                        : 'hover:bg-gray-50 text-deep-navy/80'
                    }`}
                  >
                    <spec.icon className="h-5 w-5 mr-3" />
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending AI Skills */}
            <div className="bg-white rounded-2xl shadow-enterprise p-6 border border-soft-gray">
              <h3 className="font-semibold text-lg text-deep-navy mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-electric-orange" />
                Trending AI Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingSkills.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(skill.name)}
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-50 hover:bg-gray-100 text-deep-navy/80 hover:text-neon-coral transition-colors border border-gray-200 hover:border-neon-coral/30"
                  >
                    {skill.name}
                    <span className="ml-1 text-xs text-gray-500">{skill.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level Filter */}
            <div className="bg-white rounded-2xl shadow-enterprise p-6 border border-soft-gray">
              <h3 className="font-semibold text-lg text-deep-navy mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-neon-coral" />
                Experience Level
              </h3>
              <div className="space-y-2">
                {experienceLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setExperienceFilter(level.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-all ${
                      experienceFilter === level.id
                        ? 'bg-gradient-to-r from-neon-coral/5 to-aqua-blue/5 border border-neon-coral/20 text-neon-coral font-medium'
                        : 'hover:bg-gray-50 text-deep-navy/80'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Active Filters */}
            {(searchTerm || locationFilter || jobTypeFilter || activeSpecialization !== 'all' || experienceFilter !== 'all') && (
              <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-soft-gray/50 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-deep-navy/70 mr-2">Active filters:</span>
                  
                  {searchTerm && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <span className="text-sm text-deep-navy">Search: {searchTerm}</span>
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="ml-2 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  
                  {locationFilter && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <MapPin className="w-3.5 h-3.5 text-deep-navy/60 mr-1" />
                      <span className="text-sm text-deep-navy">{locationFilter}</span>
                      <button 
                        onClick={() => setLocationFilter('')}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  
                  {jobTypeFilter && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <Briefcase className="w-3.5 h-3.5 text-deep-navy/60 mr-1" />
                      <span className="text-sm text-deep-navy">{jobTypeFilter}</span>
                      <button 
                        onClick={() => setJobTypeFilter('')}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  
                  {activeSpecialization !== 'all' && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <Brain className="w-3.5 h-3.5 text-neon-coral mr-1" />
                      <span className="text-sm text-deep-navy">
                        {aiSpecializations.find(s => s.id === activeSpecialization)?.name || activeSpecialization}
                      </span>
                      <button 
                        onClick={() => setActiveSpecialization('all')}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  
                  {experienceFilter !== 'all' && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <GraduationCap className="w-3.5 h-3.5 text-aqua-blue mr-1" />
                      <span className="text-sm text-deep-navy">
                        {experienceLevels.find(l => l.id === experienceFilter)?.label || experienceFilter}
                      </span>
                      <button 
                        onClick={() => setExperienceFilter('all')}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setLocationFilter('');
                      setJobTypeFilter('');
                      setActiveSpecialization('all');
                      setExperienceFilter('all');
                    }}
                    className="ml-auto flex items-center text-sm text-neon-coral hover:text-neon-coral/80 transition-colors font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredJobs.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-deep-navy">
                      {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
                    </h2>
                    <div className="flex items-center
                    ">
                      <span className="text-sm text-deep-navy/70 mr-2">Sort by:</span>
                      <select 
                        className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neon-coral/50 focus:border-neon-coral/30"
                        defaultValue="relevance"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="newest">Newest</option>
                        <option value="salary-high">Salary: High to Low</option>
                        <option value="salary-low">Salary: Low to High</option>
                      </select>
                    </div>
                  </div>
                  
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-enterprise border border-soft-gray/50">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-neon-coral/10 to-aqua-blue/10 mb-4">
                    <Briefcase className="h-8 w-8 text-deep-navy/70" />
                  </div>
                  <h3 className="text-xl font-medium text-deep-navy mb-2">No matching jobs found</h3>
                  <p className="text-deep-navy/70 max-w-md mx-auto mb-6">
                    We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button 
                      variant="outline" 
                      className="border-neon-coral/30 text-neon-coral hover:bg-neon-coral/5 hover:border-neon-coral/50"
                      onClick={() => {
                        setSearchTerm('');
                        setLocationFilter('');
                        setJobTypeFilter('');
                        setActiveSpecialization('all');
                      }}
                    >
                      Clear all filters
                    </Button>
                    <Button 
                      variant="default" 
                      className="bg-gradient-to-r from-neon-coral to-aqua-blue hover:from-neon-coral/90 hover:to-aqua-blue/90"
                      onClick={() => {
                        setSearchTerm('AI');
                      }}
                    >
                      Show AI Jobs
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
