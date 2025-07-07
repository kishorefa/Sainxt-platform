"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Settings,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  ArrowUpDown,
  Filter,
  Download,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/enterprise/dashboard", icon: TrendingUp },
  { title: "Job Listings", href: "/enterprise/jobs", icon: Briefcase },
  { title: "Candidates", href: "/enterprise/candidates", icon: Users },
  { title: "Interviews", href: "/enterprise/interviews", icon: Calendar },
  { title: "Analytics", href: "/enterprise/analytics", icon: TrendingUp },
  { title: "Settings", href: "/enterprise/settings", icon: Settings },
];

const jobsData = [
  {
    id: "1",
    title: "Senior Data Scientist",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "active",
    applications: 24,
    priority: "high",
    postedDate: "2024-01-15",
    closingDate: "2024-02-15",
    salary: "$120k - $180k",
  },
  {
    id: "2",
    title: "ML Engineer",
    department: "AI/ML",
    location: "Remote",
    type: "Full-time",
    status: "active",
    applications: 18,
    priority: "medium",
    postedDate: "2024-01-12",
    closingDate: "2024-02-12",
    salary: "$110k - $160k",
  },
  {
    id: "3",
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    status: "closed",
    applications: 31,
    priority: "low",
    postedDate: "2024-01-08",
    closingDate: "2024-01-30",
    salary: "$130k - $190k",
  },
  {
    id: "4",
    title: "Frontend Developer",
    department: "Engineering",
    location: "Austin, TX",
    type: "Contract",
    status: "draft",
    applications: 0,
    priority: "medium",
    postedDate: "2024-01-16",
    closingDate: "2024-02-16",
    salary: "$80k - $120k",
  },
  {
    id: "5",
    title: "UX Designer",
    department: "Design",
    location: "Los Angeles, CA",
    type: "Full-time",
    status: "paused",
    applications: 12,
    priority: "low",
    postedDate: "2024-01-10",
    closingDate: "2024-02-10",
    salary: "$90k - $140k",
  },
];

const getStatusBadge = (status) => {
  const statusConfig = {
    active: { variant: "default", label: "Active" },
    closed: { variant: "secondary", label: "Closed" },
    draft: { variant: "outline", label: "Draft" },
    paused: { variant: "destructive", label: "Paused" },
  };

  const config = statusConfig[status] || statusConfig.active;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getPriorityBadge = (priority) => {
  const priorityConfig = {
    high: { className: "bg-red-100 text-red-800", label: "High" },
    medium: { className: "bg-yellow-100 text-yellow-800", label: "Medium" },
    low: { className: "bg-green-100 text-green-800", label: "Low" },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;
  return <Badge className={config.className}>{config.label}</Badge>;
};

// Columns for DataTable
const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="h-auto p-0 font-medium"
      >
        Job Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium">{job.title}</div>
          <div className="text-sm text-muted-foreground">
            {job.department}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="space-y-1">
          <div>{job.location}</div>
          <div className="text-sm text-muted-foreground">{job.type}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => getPriorityBadge(row.getValue("priority")),
  },
  {
    accessorKey: "applications",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="h-auto p-0 font-medium"
      >
        Applications
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const applications = row.getValue("applications");
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{applications}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "salary",
    header: "Salary Range",
  },
  {
    accessorKey: "postedDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="h-auto p-0 font-medium"
      >
        Posted Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("postedDate"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const job = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Job
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function JobListingsPage() {
  const [selectedJobs, setSelectedJobs] = useState([]);

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="enterprise"
      userName="Jane Smith"
      userEmail="jane@company.com"
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/enterprise">Enterprise</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Job Listings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Listings</h1>
            <p className="text-muted-foreground">Manage and track all your job postings in one place</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold">{jobsData.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold">{jobsData.filter((job) => job.status === "active").length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{jobsData.reduce((sum, job) => sum + job.applications, 0)}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Draft Jobs</p>
                  <p className="text-2xl font-bold">{jobsData.filter((job) => job.status === "draft").length}</p>
                </div>
                <Edit className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Job Listings</CardTitle>
            <CardDescription>
              A comprehensive view of all your job postings with advanced filtering and sorting options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={jobsData} searchKey="title" searchPlaceholder="Search jobs..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
