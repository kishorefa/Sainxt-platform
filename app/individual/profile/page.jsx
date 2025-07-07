"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ScoreCard from "@/components/ScoreCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import "react-circular-progressbar/dist/styles.css";
import RadarSkillChart from "@/components/RadarSkillChart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  BookOpen,
  Award,
  Briefcase,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Upload,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Plus,
  Trash2,
  X,
  Globe,
  Building,
  Zap,
  Sparkles,
  Laptop,
  Lightbulb,
  DollarSign,
  MapPinned,
  BriefcaseIcon,
  Users,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: TrendingUp },
  { title: "Profile Builder", href: "/individual/profile", icon: User },
  //{ title: "Skills & Experience", href: "/individual/skills", icon: Target },
 // { title: "Assessments", href: "/individual/assessments", icon: BookOpen },
 // { title: "Certificates", href: "/individual/certificates", icon: Award },
  //  title: "Training Programs",href: "/individual/training",icon: BookOpen,badge: "New",
//  { title: "Internships", href: "/individual/internships", icon: Briefcase },
//  { title: "Settings", href: "/individual/settings", icon: BookOpen },
 { title: "AI101", href: "/individual/introductory-training", icon: BookOpen },
 { title: "Thought Leadership", href: "/individual/thought-leadership", icon: BookOpen },
{ title: "View Jobs", href: "/individual/jobs", icon: Briefcase },
];

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic details about you",
  },
  { id: 2, title: "Education", description: "Your educational background" },
  { id: 3, title: "Experience", description: "Work and project experience" },
  { id: 4, title: "Skills", description: "Technical and soft skills" },
  { id: 5, title: "Preferences", description: "Career goals and preferences" },
];

// Predefined skill options
const technicalSkillOptions = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Git",
  "Machine Learning",
  "Data Science",
  "AI",
  "Blockchain",
  "IoT",
  "Mobile Development",
  "DevOps",
];

const softSkillOptions = [
  "Communication",
  "Teamwork",
  "Problem Solving",
  "Critical Thinking",
  "Time Management",
  "Leadership",
  "Adaptability",
  "Creativity",
  "Emotional Intelligence",
  "Conflict Resolution",
  "Negotiation",
  "Presentation Skills",
  "Project Management",
];

// Job types
const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote",
];

// Work environments
const workEnvironments = ["Remote", "Hybrid", "On-site", "Flexible"];

// Industries
const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Media",
  "Government",
  "Non-profit",
  "Consulting",
];

// Company sizes
const companySizes = [
  "Startup (1-10)",
  "Small (11-50)",
  "Medium (51-200)",
  "Large (201-1000)",
  "Enterprise (1000+)",
];

export default function ProfileBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showMarketReadinessPrompt, setShowMarketReadinessPrompt] =
    useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showDetailedRecommendations, setShowDetailedRecommendations] =
    useState(false);
  const [user, setUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    dateOfBirth: "1995-05-15",
    bio: "Experienced software developer with a passion for AI and machine learning. Looking to leverage my skills in a challenging role.",

    // Education
    university: "Stanford University",
    degree: "Bachelor's Degree",
    major: "Computer Science",
    graduationYear: "2020",
    gpa: "3.8",
    additionalEducation: [],

    // Experience
    workExperiences: [
      {
        id: 1,
        title: "Software Engineer",
        company: "Tech Solutions Inc.",
        location: "San Francisco, CA",
        startDate: "2020-06",
        endDate: "2023-05",
        current: false,
        description:
          "Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.",
      },
    ],
    projects: [
      {
        id: 1,
        title: "E-commerce Platform",
        url: "https://github.com/johndoe/ecommerce",
        startDate: "2022-01",
        endDate: "2022-04",
        description:
          "Built a full-stack e-commerce platform using React, Node.js, and MongoDB. Implemented features such as user authentication, product catalog, and payment processing.",
      },
    ],

    // Skills
    technicalSkills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    softSkills: ["Communication", "Problem Solving", "Teamwork"],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Intermediate" },
    ],

    // Preferences
    jobTypes: ["Full-time", "Remote"],
    salaryExpectation: "100000",
    willingToRelocate: false,
    preferredLocations: ["San Francisco, CA", "Seattle, WA"],
    preferredIndustries: ["Technology", "Finance"],
    preferredCompanySize: ["Medium (51-200)", "Large (201-1000)"],
    workEnvironment: "Hybrid",
    careerGoals:
      "Looking to grow as a full-stack developer and eventually move into a technical leadership role. Interested in working on innovative products that solve real-world problems.",
  });

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get token from localStorage
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

        // If no token, use demo mode
        if (!token) {
          console.log("No access token found. Running in demo mode.");
          setIsAuthenticated(true);
          setUser({
            email: "demo@example.com",
            name: "Demo User",
            role: "individual",
          });
          return;
        }

        // If token exists, try to fetch user data
        console.log("Access token found, fetching user data...");
        const response = await fetch(
          "http://192.168.0.207:5000/api/read_users_me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            console.warn("User endpoint not found. Using demo user.");
          } else {
            console.warn(
              `API returned status ${response.status}. Using demo user.`
            );
          }
          setIsAuthenticated(true);
          setUser({
            email: "demo@example.com",
            name: "Demo User",
            role: "individual",
          });
          return;
        }

        // If we get here, we have valid user data
        const userData = await response.json();
        setIsAuthenticated(true);
        setUser({
          email: userData.email || "demo@example.com",
          name: userData.name || "Demo User",
          role: userData.role || "individual",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAuthenticated(false);
        setUser({
          email: "default@example.com",
          name: "Guest User",
          role: "guest",
        });
      }
    };

    checkAuth();
  }, []);

  const validateCurrentStep = () => {
    const errors = {};

    // Personal Information validation
    if (currentStep === 1) {
      if (!formData.firstName.trim())
        errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Education validation
    else if (currentStep === 2) {
      if (!formData.university.trim())
        errors.university = "University/Institution is required";
      if (!formData.degree) errors.degree = "Degree level is required";
      if (!formData.major.trim())
        errors.major = "Major/Field of study is required";
      if (formData.graduationYear && isNaN(formData.graduationYear)) {
        errors.graduationYear = "Please enter a valid year";
      }
      if (
        formData.gpa &&
        (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4.0)
      ) {
        errors.gpa = "Please enter a valid GPA between 0 and 4.0";
      }
    }

    // Experience validation
    else if (currentStep === 3) {
      // No validation for work experiences or projects - all fields are optional
      formData.workExperiences.forEach((exp) => {
        // Only validate date consistency if both dates are provided
        if (
          exp.startDate &&
          exp.endDate &&
          !exp.current &&
          new Date(exp.startDate) > new Date(exp.endDate)
        ) {
          errors[`workExpEndDate_${exp.id}`] =
            "End date must be after start date";
        }
      });
    }

    // Skills validation
    else if (currentStep === 4) {
      if (formData.technicalSkills.length === 0) {
        errors.technicalSkills = "At least one technical skill is required";
      }
      if (formData.softSkills.length === 0) {
        errors.softSkills = "At least one soft skill is required";
      }

      // Validate languages
      formData.languages.forEach((lang, index) => {
        if (!lang.language.trim()) {
          errors[`language_${index}`] = "Language is required";
        }
        if (!lang.proficiency) {
          errors[`proficiency_${index}`] = "Proficiency level is required";
        }
      });
    }

    // Preferences validation - No validations, all fields are optional
    else if (currentStep === 5) {
      // No validations for preferences section
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      // Scroll to the first error
      const firstError = Object.keys(formErrors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      setFormErrors({}); // Clear errors when moving to next step
    } else {
      try {
        // First, save all profile data to the backend
        await submitProfileToBackend();

        // Show market readiness prompt
        setShowMarketReadinessPrompt(true);
      } catch (error) {
        console.error("Error saving profile:", error);
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleMarketReadinessConfirm = async () => {
    try {
      setIsLoading(true);
      setShowMarketReadinessPrompt(false);

      // Show loading toast
      const loadingToast = toast({
        title: "Analyzing your profile",
        description: "Please wait while we analyze your profile...",
        duration: 0, // Keep the toast open until we close it
      });

      // Call the AI review API
      const response = await fetch(
        "http://192.168.0.207:5000/api/ai-review/generate-scores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate AI review");
      }

      const result = await response.json();
      setAiResults(result);
      setShowResults(true);

      // Update the toast to show success
      toast.dismiss(loadingToast);
      toast({
        title: "Analysis Complete!",
        description: "Your profile has been analyzed.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating AI review:", error);
      toast({
        title: "Error",
        description: "Failed to analyze profile. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your profile draft has been saved.",
      variant: "default",
    });
  };

  // Experience handlers
  const addWorkExperience = () => {
    const newExperience = {
      id: formData.workExperiences.length + 1,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setFormData({
      ...formData,
      workExperiences: [...formData.workExperiences, newExperience],
    });
  };

  const updateWorkExperience = (id, field, value) => {
    setFormData({
      ...formData,
      workExperiences: formData.workExperiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeWorkExperience = (id) => {
    setFormData({
      ...formData,
      workExperiences: formData.workExperiences.filter((exp) => exp.id !== id),
    });
  };

  const addProject = () => {
    const newProject = {
      id: formData.projects.length + 1,
      title: "",
      url: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setFormData({
      ...formData,
      projects: [...formData.projects, newProject],
    });
  };

  const updateProject = (id, field, value) => {
    setFormData({
      ...formData,
      projects: formData.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    });
  };

  const removeProject = (id) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((project) => project.id !== id),
    });
  };

  // Skills handlers
  const toggleTechnicalSkill = (skill) => {
    if (formData.technicalSkills.includes(skill)) {
      setFormData({
        ...formData,
        technicalSkills: formData.technicalSkills.filter((s) => s !== skill),
      });
    } else {
      setFormData({
        ...formData,
        technicalSkills: [...formData.technicalSkills, skill],
      });
    }
  };

  const toggleSoftSkill = (skill) => {
    if (formData.softSkills.includes(skill)) {
      setFormData({
        ...formData,
        softSkills: formData.softSkills.filter((s) => s !== skill),
      });
    } else {
      setFormData({
        ...formData,
        softSkills: [...formData.softSkills, skill],
      });
    }
  };

  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [
        ...formData.languages,
        { language: "", proficiency: "Beginner" },
      ],
    });
  };

  const updateLanguage = (index, field, value) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setFormData({
      ...formData,
      languages: updatedLanguages,
    });
  };

  const removeLanguage = (index) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index),
    });
  };

  // Preferences handlers
  const toggleJobType = (jobType) => {
    if (formData.jobTypes.includes(jobType)) {
      setFormData({
        ...formData,
        jobTypes: formData.jobTypes.filter((type) => type !== jobType),
      });
    } else {
      setFormData({
        ...formData,
        jobTypes: [...formData.jobTypes, jobType],
      });
    }
  };

  const addLocation = (location) => {
    if (location && !formData.preferredLocations.includes(location)) {
      setFormData({
        ...formData,
        preferredLocations: [...formData.preferredLocations, location],
      });
    }
  };

  const removeLocation = (location) => {
    setFormData({
      ...formData,
      preferredLocations: formData.preferredLocations.filter(
        (loc) => loc !== location
      ),
    });
  };

  const toggleIndustry = (industry) => {
    if (formData.preferredIndustries.includes(industry)) {
      setFormData({
        ...formData,
        preferredIndustries: formData.preferredIndustries.filter(
          (ind) => ind !== industry
        ),
      });
    } else {
      setFormData({
        ...formData,
        preferredIndustries: [...formData.preferredIndustries, industry],
      });
    }
  };

  const toggleCompanySize = (size) => {
    if (formData.preferredCompanySize.includes(size)) {
      setFormData({
        ...formData,
        preferredCompanySize: formData.preferredCompanySize.filter(
          (s) => s !== size
        ),
      });
    } else {
      setFormData({
        ...formData,
        preferredCompanySize: [...formData.preferredCompanySize, size],
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Enter your first name"
                  className={formErrors.firstName ? "border-red-500" : ""}
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Enter your last name"
                  className={formErrors.lastName ? "border-red-500" : ""}
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your.email@example.com"
                    className={`pl-10 ${
                      formErrors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="City, State, Country"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself, your interests, and career goals..."
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                A compelling bio helps employers understand your background and
                aspirations.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="university">University/Institution *</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) =>
                    setFormData({ ...formData, university: e.target.value })
                  }
                  placeholder="e.g., Stanford University"
                  className={formErrors.university ? "border-red-500" : ""}
                />
                {formErrors.university && (
                  <p className="text-sm text-red-500">
                    {formErrors.university}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">Degree Level *</Label>
                <Select
                  value={formData.degree}
                  onValueChange={(value) =>
                    setFormData({ ...formData, degree: value })
                  }
                >
                  <SelectTrigger
                    className={formErrors.degree ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select degree level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="associate">
                      Associate's Degree
                    </SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">Ph.D.</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.degree && (
                  <p className="text-sm text-red-500">{formErrors.degree}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major/Field of Study *</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) =>
                    setFormData({ ...formData, major: e.target.value })
                  }
                  placeholder="e.g., Computer Science"
                  className={formErrors.major ? "border-red-500" : ""}
                />
                {formErrors.major && (
                  <p className="text-sm text-red-500">{formErrors.major}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Select
                  value={formData.graduationYear}
                  onValueChange={(value) =>
                    setFormData({ ...formData, graduationYear: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + 5 - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA (Optional)</Label>
                <Input
                  id="gpa"
                  value={formData.gpa}
                  onChange={(e) =>
                    setFormData({ ...formData, gpa: e.target.value })
                  }
                  placeholder="e.g., 3.8"
                />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Additional Education</h4>
              <Button variant="outline" className="w-full">
                + Add Another Degree or Certification
              </Button>
            </div>
          </div>
        );

      case 3: // Experience
        return (
          <div className="space-y-8">
            {/* Work Experience Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                  Work Experience
                </h3>
                <Button
                  onClick={addWorkExperience}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Experience
                </Button>
              </div>

              {formData.workExperiences.map((experience, index) => (
                <Card key={experience.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeWorkExperience(experience.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`job-title-${experience.id}`}>
                          Job Title *
                        </Label>
                        <Input
                          id={`workExpTitle_${experience.id}`}
                          value={experience.title}
                          onChange={(e) =>
                            updateWorkExperience(
                              experience.id,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Software Engineer"
                          className={
                            formErrors[`workExpTitle_${experience.id}`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formErrors[`workExpTitle_${experience.id}`] && (
                          <p className="text-sm text-red-500">
                            {formErrors[`workExpTitle_${experience.id}`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`company-${experience.id}`}>
                          Company *
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`workExpCompany_${experience.id}`}
                            value={experience.company}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "company",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Google"
                            className={`pl-10 ${
                              formErrors[`workExpCompany_${experience.id}`]
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                        {formErrors[`workExpCompany_${experience.id}`] && (
                          <p className="text-sm text-red-500">
                            {formErrors[`workExpCompany_${experience.id}`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`work-location-${experience.id}`}>
                          Location
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`work-location-${experience.id}`}
                            value={experience.location}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "location",
                                e.target.value
                              )
                            }
                            placeholder="e.g., San Francisco, CA"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`start-date-${experience.id}`}>
                            Start Date *
                          </Label>
                          <Input
                            id={`workExpStartDate_${experience.id}`}
                            type="month"
                            value={experience.startDate}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "startDate",
                                e.target.value
                              )
                            }
                            className={
                              formErrors[`workExpStartDate_${experience.id}`]
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {formErrors[`workExpStartDate_${experience.id}`] && (
                            <p className="text-sm text-red-500">
                              {formErrors[`workExpStartDate_${experience.id}`]}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor={`end-date-${experience.id}`}>
                              End Date
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`current-job-${experience.id}`}
                                checked={experience.current}
                                onCheckedChange={(checked) =>
                                  updateWorkExperience(
                                    experience.id,
                                    "current",
                                    checked
                                  )
                                }
                              />
                              <Label
                                htmlFor={`current-job-${experience.id}`}
                                className="text-sm font-normal"
                              >
                                Current
                              </Label>
                            </div>
                          </div>
                          <Input
                            id={`end-date-${experience.id}`}
                            type="month"
                            value={experience.endDate}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "endDate",
                                e.target.value
                              )
                            }
                            disabled={experience.current}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`description-${experience.id}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`description-${experience.id}`}
                        value={experience.description}
                        onChange={(e) =>
                          updateWorkExperience(
                            experience.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {formData.workExperiences.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Briefcase className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-muted-foreground">
                    No work experience added yet
                  </h4>
                  <Button
                    onClick={addWorkExperience}
                    variant="outline"
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Work Experience
                  </Button>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Laptop className="mr-2 h-5 w-5 text-[#33D6C4]" />
                  Projects
                </h3>
                <Button
                  onClick={addProject}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Project
                </Button>
              </div>

              {formData.projects.map((project) => (
                <Card key={project.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`project-title-${project.id}`}>
                          Project Title *
                        </Label>
                        <Input
                          id={`projectTitle_${project.id}`}
                          value={project.title}
                          onChange={(e) =>
                            updateProject(project.id, "title", e.target.value)
                          }
                          placeholder="e.g., E-commerce Platform"
                          className={
                            formErrors[`projectTitle_${project.id}`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formErrors[`projectTitle_${project.id}`] && (
                          <p className="text-sm text-red-500">
                            {formErrors[`projectTitle_${project.id}`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-url-${project.id}`}>
                          Project URL
                        </Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`project-url-${project.id}`}
                            value={project.url}
                            onChange={(e) =>
                              updateProject(project.id, "url", e.target.value)
                            }
                            placeholder="e.g., https://github.com/username/project"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-start-${project.id}`}>
                          Start Date
                        </Label>
                        <Input
                          id={`project-start-${project.id}`}
                          type="month"
                          value={project.startDate}
                          onChange={(e) =>
                            updateProject(
                              project.id,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-end-${project.id}`}>
                          End Date
                        </Label>
                        <Input
                          id={`project-end-${project.id}`}
                          type="month"
                          value={project.endDate}
                          onChange={(e) =>
                            updateProject(project.id, "endDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`project-description-${project.id}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`project-description-${project.id}`}
                        value={project.description}
                        onChange={(e) =>
                          updateProject(
                            project.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe the project, technologies used, and your role..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {formData.projects.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Laptop className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-muted-foreground">
                    No projects added yet
                  </h4>
                  <Button
                    onClick={addProject}
                    variant="outline"
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Project
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-[#F8F9FA] p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium">Pro Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    Adding detailed work experience and projects helps employers
                    understand your capabilities and increases your chances of
                    getting matched with relevant opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Skills
        return (
          <div className="space-y-8">
            {/* Technical Skills Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Zap className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Technical Skills
              </h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select all the technical skills that apply to you
                </Label>
                <div className="flex flex-wrap gap-2">
                  {formData.technicalSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-[#33D6C4] text-white hover:bg-[#2bc0b0] cursor-pointer flex items-center gap-1 px-3 py-1"
                      onClick={() => toggleTechnicalSkill(skill)}
                    >
                      {skill}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 border rounded-lg p-4">
                  <div className="text-sm font-medium mb-2">Add Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {technicalSkillOptions
                      .filter(
                        (skill) => !formData.technicalSkills.includes(skill)
                      )
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-[#EDEFF2]"
                          onClick={() => toggleTechnicalSkill(skill)}
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Soft Skills Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Soft Skills
              </h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select all the soft skills that apply to you
                </Label>
                <div className="flex flex-wrap gap-2">
                  {formData.softSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-[#FF6B4A] text-white hover:bg-[#e85d3d] cursor-pointer flex items-center gap-1 px-3 py-1"
                      onClick={() => toggleSoftSkill(skill)}
                    >
                      {skill}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 border rounded-lg p-4">
                  <div className="text-sm font-medium mb-2">Add Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {softSkillOptions
                      .filter((skill) => !formData.softSkills.includes(skill))
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-[#EDEFF2]"
                          onClick={() => toggleSoftSkill(skill)}
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Languages Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                  Languages
                </h3>
                <Button
                  onClick={addLanguage}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Language
                </Button>
              </div>

              {formData.languages.map((lang, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`language-${index}`}>Language</Label>
                    <Input
                      id={`language-${index}`}
                      value={lang.language}
                      onChange={(e) =>
                        updateLanguage(index, "language", e.target.value)
                      }
                      placeholder="e.g., English"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`proficiency-${index}`}>Proficiency</Label>
                    <Select
                      value={lang.proficiency}
                      onValueChange={(value) =>
                        updateLanguage(index, "proficiency", value)
                      }
                    >
                      <SelectTrigger id={`proficiency-${index}`}>
                        <SelectValue placeholder="Select proficiency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Fluent">Fluent</SelectItem>
                        <SelectItem value="Native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLanguage(index)}
                    className="mb-2"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-[#F8F9FA] p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium">AI-Powered Skill Matching</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI will analyze your skills to match you with the most
                    relevant job opportunities. The more skills you add, the
                    better your matches will be.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Preferences
        return (
          <div className="space-y-8">
            {/* Job Types Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <BriefcaseIcon className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Job Types
              </h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select all job types you're interested in
                </Label>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((jobType) => (
                    <Badge
                      key={jobType}
                      variant={
                        formData.jobTypes.includes(jobType)
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        formData.jobTypes.includes(jobType)
                          ? "bg-[#33D6C4] text-white hover:bg-[#2bc0b0] cursor-pointer"
                          : "cursor-pointer hover:bg-[#EDEFF2]"
                      }
                      onClick={() => toggleJobType(jobType)}
                    >
                      {formData.jobTypes.includes(jobType)
                        ? `${jobType} ✓`
                        : jobType}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Salary Expectations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Salary Expectations
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Annual Salary (USD)</Label>
                  <span className="font-medium">
                    $
                    {Number.parseInt(
                      formData.salaryExpectation
                    ).toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[Number.parseInt(formData.salaryExpectation)]}
                  min={30000}
                  max={250000}
                  step={5000}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      salaryExpectation: value[0].toString(),
                    })
                  }
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$30,000</span>
                  <span>$250,000+</span>
                </div>
              </div>
            </div>

            {/* Location Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <MapPinned className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Location Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="relocate"
                    checked={formData.willingToRelocate}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, willingToRelocate: checked })
                    }
                  />
                  <Label htmlFor="relocate">Willing to relocate</Label>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Locations</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.preferredLocations.map((location) => (
                      <Badge
                        key={location}
                        variant="secondary"
                        className="bg-[#FF6B4A] text-white hover:bg-[#e85d3d] cursor-pointer flex items-center gap-1 px-3 py-1"
                      >
                        {location}
                        <X
                          className="h-3 w-3 ml-1"
                          onClick={() => removeLocation(location)}
                        />
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      id="new-location"
                      placeholder="Add a location (e.g., New York, NY)"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addLocation(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById("new-location");

                        addLocation(input.value);
                        input.value = "";
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Environment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Building className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Work Environment
              </h3>

              <div className="space-y-2">
                <Label>Preferred Work Environment</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {workEnvironments.map((env) => (
                    <Button
                      key={env}
                      type="button"
                      variant={
                        formData.workEnvironment === env ? "default" : "outline"
                      }
                      className={
                        formData.workEnvironment === env
                          ? "bg-[#FF5E3A] hover:bg-[#e04c2b]"
                          : ""
                      }
                      onClick={() =>
                        setFormData({ ...formData, workEnvironment: env })
                      }
                    >
                      {env}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Industry Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Industry Preferences
              </h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select industries you're interested in working in
                </Label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <Badge
                      key={industry}
                      variant={
                        formData.preferredIndustries.includes(industry)
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        formData.preferredIndustries.includes(industry)
                          ? "bg-[#33D6C4] text-white hover:bg-[#2bc0b0] cursor-pointer"
                          : "cursor-pointer hover:bg-[#EDEFF2]"
                      }
                      onClick={() => toggleIndustry(industry)}
                    >
                      {formData.preferredIndustries.includes(industry)
                        ? `${industry} ✓`
                        : industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Size */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Company Size
              </h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select preferred company sizes
                </Label>
                <div className="flex flex-wrap gap-2">
                  {companySizes.map((size) => (
                    <Badge
                      key={size}
                      variant={
                        formData.preferredCompanySize.includes(size)
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        formData.preferredCompanySize.includes(size)
                          ? "bg-[#FF6B4A] text-white hover:bg-[#e85d3d] cursor-pointer"
                          : "cursor-pointer hover:bg-[#EDEFF2]"
                      }
                      onClick={() => toggleCompanySize(size)}
                    >
                      {formData.preferredCompanySize.includes(size)
                        ? `${size} ✓`
                        : size}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Target className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Career Goals
              </h3>

              <div className="space-y-2">
                <Label htmlFor="career-goals">
                  Describe your career goals and aspirations
                </Label>
                <Textarea
                  id="career-goals"
                  value={formData.careerGoals}
                  onChange={(e) =>
                    setFormData({ ...formData, careerGoals: e.target.value })
                  }
                  placeholder="What are your short and long-term career goals? What kind of role are you looking for next?"
                  rows={4}
                />
              </div>
            </div>

            <div className="bg-[#F8F9FA] p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium">AI-Powered Job Matching</h4>
                  <p className="text-sm text-muted-foreground">
                    Your preferences help our AI match you with jobs that align
                    with your career goals and work style. Be specific about
                    what matters most to you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              Step {currentStep} Content
            </h3>
            <p className="text-muted-foreground">
              This step is under construction. Continue to see the complete
              flow.
            </p>
          </div>
        );
    }
  };

  const submitProfileToBackend = async () => {
    try {
      // Submit personal information
      const profileResponse = await fetch(
        "http://192.168.0.207:5000/api/save_profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            dob: formData.dateOfBirth,
            description: formData.bio,
          }),
        }
      );
      if (!profileResponse.ok) throw new Error("Failed to save profile");

      // Submit education
      const educationResponse = await fetch(
        "http://192.168.0.207:5000/api/save_education",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            university: formData.university,
            degree_level: formData.degree,
            major: formData.major,
            graduation_year: formData.graduationYear,
            cgpa: formData.gpa,
            additional_info: formData.additionalEducation.join(", "),
          }),
        }
      );
      if (!educationResponse.ok) throw new Error("Failed to save education");

      // Submit experience
      if (formData.workExperiences.length > 0) {
        const exp =
          formData.workExperiences[formData.workExperiences.length - 1];
        const experienceResponse = await fetch(
          "http://192.168.0.207:5000/api/save_experience",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              work_experience: exp.title,
              job_title: exp.title,
              company: exp.company,
              location: exp.location,
              start_date: exp.startDate,
              end_date: exp.endDate,
              description: exp.description,
            }),
          }
        );
        if (!experienceResponse.ok)
          throw new Error("Failed to save experience");
      }

      // Submit project
      if (formData.projects.length > 0) {
        const proj = formData.projects[formData.projects.length - 1];
        const projectResponse = await fetch(
          "http://192.168.0.207:5000/api/save_project",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_title: proj.title,
              project_url: proj.url,
              start_date: proj.startDate,
              end_date: proj.endDate,
              description: proj.description,
            }),
          }
        );
        if (!projectResponse.ok) throw new Error("Failed to save project");
      }

      // Submit skills
      const skillsResponse = await fetch(
        "http://192.168.0.207:5000/api/save_skills",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            technical_skills: formData.technicalSkills.join(", "),
            soft_skills: formData.softSkills.join(", "),
            language:
              formData.languages.length > 0
                ? formData.languages[0].language
                : "",
            proficiency:
              formData.languages.length > 0
                ? formData.languages[0].proficiency
                : "",
          }),
        }
      );
      if (!skillsResponse.ok) throw new Error("Failed to save skills");

      // Submit preferences
      const preferencesResponse = await fetch(
        "http://192.168.0.207:5000/api/save_preferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_types: formData.jobTypes.join(", "),
            salary_expectations: formData.salaryExpectation,
            location_preferences: formData.preferredLocations.join(", "),
            work_environment: formData.workEnvironment,
            industry_preferences: formData.preferredIndustries.join(", "),
            company_size: formData.preferredCompanySize.join(", "),
            career_goals: formData.careerGoals,
          }),
        }
      );
      if (!preferencesResponse.ok)
        throw new Error("Failed to save preferences");

      console.log("Profile successfully submitted to backend");
    } catch (error) {
      console.error("Error submitting profile to backend:", error);
      throw error;
    }
  };
  const radarChartScores = {
    communication: aiResults?.scores?.soft_skills_score || 0,
    leadership: aiResults?.scores?.qualification_score || 0,
    technical: aiResults?.scores?.skill_score || 0,
    domain: aiResults?.scores?.qualification_score || 0,
    problemSolving: aiResults?.scores?.profile_score || 0,
  };

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName="John Doe"
      userEmail="john@example.com"
    >
      {/* Market Readiness Prompt */}
      <Dialog open={showMarketReadinessPrompt} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg">
          {!isLoading && !showResults && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">
                  Market Readiness Assessment
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Are you interested to know where you stand currently in terms
                  of market readiness?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => setShowMarketReadinessPrompt(false)}
                  disabled={isLoading}
                >
                  No
                </Button>
                <Button
                  className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md"
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      console.log("Calling AI review API...");
                      const response = await fetch(
                        "http://192.168.0.207:5000/api/ai-review/generate-scores",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            email: formData.email,
                          }),
                        }
                      );

                      if (!response.ok) {
                        throw new Error("Failed to generate AI review");
                      }

                      const result = await response.json();
                      setAiResults(result);
                      setShowResults(true);
                    } catch (error) {
                      console.error("Error generating AI review:", error);
                      toast({
                        title: "Error",
                        description:
                          "Failed to generate AI review. Please try again.",
                        variant: "destructive",
                      });
                      setShowMarketReadinessPrompt(false);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Analyzing..." : "Yes"}
                </Button>
              </DialogFooter>
            </>
          )}

          {isLoading && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5E3A] mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 text-center font-semibold">
                Analyzing your profile...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 font-medium">
                This may take a moment
              </p>
            </div>
          )}

          {/* {showResults && aiResults && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">Profile Analysis Complete</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Here's how your profile looks
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Profile Score</p>
                    <p className="text-2xl font-bold">{aiResults.scores?.profile_score?.toFixed(1) || 'N/A'}/5.0</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Skill Score</p>
                    <p className="text-2xl font-bold">{aiResults.scores?.skill_score?.toFixed(1) || 'N/A'}/5.0</p>
                  </div>
                </div>

                {aiResults.evaluation?.gap_analysis?.strengths?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Strengths</h4>
                    <ul className="space-y-2">
                      {aiResults.evaluation.gap_analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiResults.evaluation?.gap_analysis?.weaknesses?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Areas for Improvement</h4>
                    <ul className="space-y-2">
                      {aiResults.evaluation.gap_analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-end gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowMarketReadinessPrompt(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setShowDetailedRecommendations(true);
                  }}
                >
                  View Detailed Recommendations
                </Button>
              </DialogFooter>
            </div>
          )}

          
        </DialogContent>
      </Dialog> */}

          {/* 

      <Dialog open={showDetailedRecommendations} onOpenChange={()=>{}}>
        <DialogContent className="max-w-7xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">Detailed Recommendations</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
              Based on your profile analysis, here are detailed recommendations to improve your market readiness.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Market Fitment Analysis Section */}

          {showResults && aiResults && (
            <>
              {console.log("Profile score:", aiResults.scores?.profile_score)}
              {console.log(
                "Raw profile score value:",
                aiResults.scores?.profile_score
              )}
              {console.log("Full aiResults object:", aiResults)}
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">
                    Profile Analysis Complete
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                    Here's how your profile looks
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <ScoreCard
                      label="Profile Score"
                      score={aiResults.scores?.profile_score || 0}
                      color="#3b82f6"
                    />
                    <ScoreCard
                      label="Skill Score"
                      score={aiResults.scores?.skill_score || 0}
                      color="#10b981"
                    />
                    <ScoreCard
                      label="Qualification Score"
                      score={aiResults.scores?.qualification_score || 0}
                      color="#3b82f6"
                    />
                    <ScoreCard
                      label="Soft Skill Score"
                      score={aiResults.scores?.soft_skills_score || 0}
                      color="#f59e0b"
                    />
                  </div>

                  {aiResults.evaluation?.gap_analysis?.strengths?.length >
                    0 && (
                    <div>
                      <h4 className="font-medium mb-2">Strengths</h4>
                      <ul className="space-y-2">
                        {aiResults.evaluation.gap_analysis.strengths.map(
                          (strength, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                className="h-8 w-8 text-green-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              {strength}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {aiResults.evaluation?.gap_analysis?.weaknesses?.length >
                    0 && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {aiResults.evaluation.gap_analysis.weaknesses.map(
                          (weakness, index) => (
                            <li key={index} className="flex items-center">
                              <svg
                                className="h-7 w-7 text-yellow-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300">
                                {weakness}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <DialogFooter className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowMarketReadinessPrompt(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailedRecommendations(true);
                    }}
                  >
                    View Detailed Recommendations
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}

          {/* {aiResults?.evaluation?.market_fitment && (
            <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-lg text-gray-900 dark:text-white">
                Market Fitment Analysis
              </h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800 dark:text-gray-200">
                    Current Fit Level
                  </h5>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            aiResults.evaluation.market_fitment.fit_level ===
                            "emerging"
                              ? "33%"
                              : aiResults.evaluation.market_fitment
                                  .fit_level === "developing"
                              ? "66%"
                              : "100%"
                          }`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {aiResults.evaluation.market_fitment.fit_level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {aiResults.evaluation.market_fitment.summary}
                  </p>
                </div>
              </div>
            </div>
          )} */}
        </DialogContent>
      </Dialog>
      {/* Detailed Recommendations sections */}
      <Dialog open={showDetailedRecommendations} onOpenChange={() => {}}>
        <DialogContent className="w-full max-w-[100rem] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">
              Detailed Recommendations
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
              Based on your profile analysis, here are detailed recommendations
              to improve your market readiness.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col lg:flex-row gap-6 mt-6 w-full">
            {aiResults?.evaluation?.gap_analysis && (
              // <div className="flex-1 space-y-4">
              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                    Gap Analysis
                  </h4>

                  {aiResults.evaluation.gap_analysis.strengths?.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium mb-1 text-green-600 dark:text-green-400">
                        Strengths
                      </h5>
                      <ul className="space-y-2">
                        {aiResults.evaluation.gap_analysis.strengths.map(
                          (strength, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300">
                                {strength}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {aiResults.evaluation.gap_analysis.weaknesses?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-1 text-yellow-600 dark:text-yellow-400">
                        Areas for Improvement
                      </h5>
                      <ul className="space-y-2">
                        {aiResults.evaluation.gap_analysis.weaknesses.map(
                          (weakness, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                className="h-5 w-5 text-yellow-500 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300">
                                {weakness}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {aiResults.evaluation.recommendations?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {aiResults.evaluation.recommendations.map(
                        (recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">
                              {typeof recommendation === "object"
                                ? recommendation.course_name ||
                                  recommendation.description ||
                                  "Unnamed Course"
                                : recommendation}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {aiResults.evaluation.skill_pathway?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                      Skill Development Pathway
                    </h4>
                    <ol className="space-y-2">
                      {aiResults.evaluation.skill_pathway.map(
                        (skill, index) => {
                          // Handle both string and object formats for skill
                          const displayText =
                            typeof skill === "string"
                              ? skill
                              : skill.current_skill
                              ? `From ${skill.current_skill} to ${
                                  skill.next_skill || "next level"
                                }`
                              : JSON.stringify(skill);

                          return (
                            <li key={index} className="flex items-start">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300 mt-0.5">
                                {displayText}
                              </span>
                            </li>
                          );
                        }
                      )}
                    </ol>
                  </div>
                )}

                {aiResults?.evaluation?.market_fitment && (
                  <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-lg text-gray-900 dark:text-white">
                      Market Fitment Analysis
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200">
                          Current Fit Level
                        </h5>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  aiResults.evaluation.market_fitment
                                    .fit_level === "emerging"
                                    ? "33%"
                                    : aiResults.evaluation.market_fitment
                                        .fit_level === "developing"
                                    ? "66%"
                                    : "100%"
                                }`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {aiResults.evaluation.market_fitment.fit_level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {aiResults.evaluation.market_fitment.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="w-[500px] shrink-0">
              <div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                  Skill Radar Overview
                </h4>
                <div className=" p-4 rounded-lg border-gray-200 dark:border-gray-700 max-w-xl mx-auto">
                  <RadarSkillChart scores={radarChartScores} />
                  <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Visual representation of your profile's key competencies
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDetailedRecommendations(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* End of Detailed Recommendations section */}
      {/* Existing Gap Analysis Section */}
      {/* {aiResults?.evaluation?.gap_analysis && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Gap Analysis</h4>
                  
                  {aiResults.evaluation.gap_analysis.strengths?.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium mb-1 text-green-600 dark:text-green-400">Strengths</h5>
                      <ul className="space-y-2">
                        {aiResults.evaluation.gap_analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {aiResults.evaluation.gap_analysis.weaknesses?.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-1 text-yellow-600 dark:text-yellow-400">Areas for Improvement</h5>
                      <ul className="space-y-2">
                        {aiResults.evaluation.gap_analysis.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {aiResults.evaluation.recommendations?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Recommendations</h4>
                    <ul className="space-y-2">
                      {aiResults.evaluation.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{typeof recommendation === 'object' ? recommendation.course_name || recommendation.description || 'Unnamed Course' : recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiResults.evaluation.skill_pathway?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Skill Development Pathway</h4>
                    <ol className="space-y-2">
                      {aiResults.evaluation.skill_pathway.map((skill, index) => {
                        // Handle both string and object formats for skill
                        const displayText = typeof skill === 'string' 
                          ? skill 
                          : skill.current_skill 
                            ? `From ${skill.current_skill} to ${skill.next_skill || 'next level'}`
                            : JSON.stringify(skill);
                            
                        return (
                          <li key={index} className="flex items-start">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{index + 1}</span>
                            <span className="text-gray-700 dark:text-gray-300 mt-0.5">{displayText}</span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowDetailedRecommendations(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}{" "}
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and career details
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <Progress
              value={(currentStep / steps.length) * 100}
              className="h-2"
              indicatorClassName="bg-[#FF5E3A]"
            />
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center min-w-0">
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      currentStep >= step.id
                        ? "bg-[#FF5E3A] text-white"
                        : "bg-[#EDEFF2] text-[#6C757D]"
                    }
                  `}
                  >
                    {step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                    w-12 h-0.5 mx-4 mt-5
                    ${currentStep > step.id ? "bg-[#FF5E3A]" : "bg-[#EDEFF2]"}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
            >
              Save Draft
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[#FF5E3A] hover:bg-[#e04c2b]"
            >
              {currentStep === steps.length ? "Complete Profile" : "Next"}
              {currentStep < steps.length && (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
