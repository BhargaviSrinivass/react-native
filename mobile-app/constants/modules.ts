import { UserRole } from '@/contexts/AuthContext';

export type ModuleField = {
  key: string;
  label: string;
  required?: boolean;
  multiline?: boolean;
  isJson?: boolean;
};

export type ModuleRequestConfig = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  fields?: ModuleField[];
  payloadBuilder?: 'marks' | 'attendance' | 'approveMarks';
};

export type ModuleConfig = {
  slug: string;
  label: string;
  description: string;
  fetch?: ModuleRequestConfig;
  submit?: ModuleRequestConfig;
};

export const modulesByRole: Record<UserRole, ModuleConfig[]> = {
  student: [
    { slug: 'dashboard', label: 'Dashboard', description: 'Role overview and quick access.' },
    {
      slug: 'marks',
      label: 'Marks',
      description: 'Submit semester marks for approval.',
      submit: {
        method: 'POST',
        path: '/api/student/marks',
        payloadBuilder: 'marks',
        fields: [
          { key: 'semester', label: 'Semester', required: true },
          { key: 'academic_year', label: 'Academic Year (optional)' },
          { key: 'exam_type', label: 'Exam Type (optional)' },
          { key: 'exam_date', label: 'Exam Date YYYY-MM-DD (optional)' },
          {
            key: 'subjects_json',
            label: 'Subjects JSON Array',
            required: true,
            multiline: true,
            isJson: true,
          },
        ],
      },
    },
    {
      slug: 'leave',
      label: 'Leave',
      description: 'Apply leave and view your requests.',
      fetch: { method: 'GET', path: '/api/student/leave' },
      submit: {
        method: 'POST',
        path: '/api/student/leave',
        fields: [
          { key: 'leave_details', label: 'Leave Details', required: true, multiline: true },
          { key: 'from_date', label: 'From Date YYYY-MM-DD', required: true },
          { key: 'to_date', label: 'To Date YYYY-MM-DD', required: true },
        ],
      },
    },
    {
      slug: 'projects',
      label: 'Projects',
      description: 'Upload project details.',
      fetch: { method: 'GET', path: '/api/student/projects' },
      submit: {
        method: 'POST',
        path: '/api/student/projects',
        fields: [
          { key: 'project_name', label: 'Project Name', required: true },
          { key: 'domain', label: 'Domain' },
          { key: 'impact', label: 'Impact', multiline: true },
          { key: 'start_date', label: 'Start Date YYYY-MM-DD' },
          { key: 'end_date', label: 'End Date YYYY-MM-DD' },
        ],
      },
    },
    {
      slug: 'internships',
      label: 'Internships',
      description: 'Manage internship records.',
      fetch: { method: 'GET', path: '/api/student/internships' },
      submit: {
        method: 'POST',
        path: '/api/student/internships',
        fields: [
          { key: 'company', label: 'Company', required: true },
          { key: 'stack_data', label: 'Tech Stack (comma separated)' },
          { key: 'start_date', label: 'Start Date YYYY-MM-DD' },
          { key: 'end_date', label: 'End Date YYYY-MM-DD' },
          { key: 'stipend', label: 'Stipend' },
        ],
      },
    },
    {
      slug: 'certificates',
      label: 'Certificates',
      description: 'View certificate submissions.',
      fetch: { method: 'GET', path: '/api/student/certificates' },
    },
    {
      slug: 'profile',
      label: 'Profile',
      description: 'Update student profile details.',
      submit: {
        method: 'POST',
        path: '/api/student/profile',
        fields: [
          { key: 'name', label: 'Name', required: true },
          { key: 'address', label: 'Address', multiline: true },
          { key: 'phone', label: 'Phone Number' },
          { key: 'parent_phone', label: 'Parent Phone Number' },
        ],
      },
    },
    { slug: 'courses', label: 'Courses', description: 'Course materials from faculty.', fetch: { method: 'GET', path: '/api/student/courses' } },
    { slug: 'attendance', label: 'Attendance', description: 'Daily attendance records.', fetch: { method: 'GET', path: '/api/student/attendance' } },
    {
      slug: 'feedback',
      label: 'Feedback',
      description: 'Share feedback with department.',
      fetch: { method: 'GET', path: '/api/student/feedback' },
      submit: {
        method: 'POST',
        path: '/api/student/feedback',
        fields: [
          { key: 'feedback', label: 'Feedback', required: true, multiline: true },
          { key: 'rating', label: 'Rating (1-10)' },
        ],
      },
    },
    { slug: 'notifications', label: 'Notifications', description: 'System notifications.', fetch: { method: 'GET', path: '/api/notifications' } },
  ],
  faculty: [
    { slug: 'dashboard', label: 'Dashboard', description: 'Role overview and quick access.' },
    { slug: 'courses', label: 'Courses', description: 'Course list and uploads.', fetch: { method: 'GET', path: '/api/faculty/courses' } },
    {
      slug: 'attendance',
      label: 'Attendance',
      description: 'Record and view attendance.',
      fetch: { method: 'GET', path: '/api/faculty/attendance' },
      submit: {
        method: 'POST',
        path: '/api/faculty/attendance',
        payloadBuilder: 'attendance',
        fields: [
          { key: 'course_id', label: 'Course ID', required: true },
          { key: 'date', label: 'Date YYYY-MM-DD (optional)' },
          { key: 'records_json', label: 'Records JSON Array', required: true, multiline: true, isJson: true },
        ],
      },
    },
    { slug: 'students', label: 'Students', description: 'Student registry.', fetch: { method: 'GET', path: '/api/faculty/students' } },
    { slug: 'projects', label: 'Projects', description: 'Project submissions by students.', fetch: { method: 'GET', path: '/api/faculty/projects' } },
    {
      slug: 'profile',
      label: 'Profile',
      description: 'Create or update faculty profile.',
      fetch: { method: 'GET', path: '/api/faculty/profile' },
      submit: {
        method: 'POST',
        path: '/api/faculty/profile',
        fields: [
          { key: 'courses', label: 'Courses (newline separated)', multiline: true },
          { key: 'department_id', label: 'Department ID' },
          { key: 'time_details', label: 'Time Details' },
          { key: 'bio', label: 'Bio', multiline: true },
        ],
      },
    },
    { slug: 'notifications', label: 'Notifications', description: 'System notifications.', fetch: { method: 'GET', path: '/api/notifications' } },
  ],
  department: [
    { slug: 'dashboard', label: 'Dashboard', description: 'Role overview and quick access.' },
    {
      slug: 'marks-approval',
      label: 'Marks Approval',
      description: 'Review and approve/reject marks.',
      fetch: { method: 'GET', path: '/api/department/pending-marks' },
      submit: {
        method: 'PUT',
        path: '/api/department/approve-marks',
        payloadBuilder: 'approveMarks',
        fields: [
          { key: 'mark_id', label: 'Mark ID', required: true },
          { key: 'action', label: 'Action (approve/reject)', required: true },
          { key: 'remarks', label: 'Remarks', multiline: true },
        ],
      },
    },
    {
      slug: 'leave-approval',
      label: 'Leave Approval',
      description: 'Pending leave approvals.',
      fetch: { method: 'GET', path: '/api/department/leave-requests' },
      submit: {
        method: 'PUT',
        path: '/api/department/leave-approval',
        fields: [
          { key: 'leave_id', label: 'Leave ID', required: true },
          { key: 'status', label: 'Status (approved/rejected)', required: true },
          { key: 'remarks', label: 'Remarks', multiline: true },
        ],
      },
    },
    { slug: 'internship-approval', label: 'Internship Approval', description: 'Pending internships.', fetch: { method: 'GET', path: '/api/department/pending-internships' } },
    { slug: 'certificates-approval', label: 'Certificates Approval', description: 'Pending certificates.', fetch: { method: 'GET', path: '/api/department/pending-certificates' } },
    {
      slug: 'activities',
      label: 'Activities',
      description: 'Department activities.',
      fetch: { method: 'GET', path: '/api/department/activities' },
      submit: {
        method: 'POST',
        path: '/api/department/activities',
        fields: [
          { key: 'department_id', label: 'Department ID' },
          { key: 'event_title', label: 'Event Title', required: true },
          { key: 'event_details', label: 'Event Details', multiline: true },
          { key: 'event_date', label: 'Event Date YYYY-MM-DD' },
        ],
      },
    },
    {
      slug: 'circulars',
      label: 'Circulars',
      description: 'Department circular management.',
      fetch: { method: 'GET', path: '/api/department/circulars' },
      submit: {
        method: 'POST',
        path: '/api/department/circulars',
        fields: [
          { key: 'department_id', label: 'Department ID' },
          { key: 'title', label: 'Title', required: true },
          { key: 'circular_details', label: 'Circular Details', multiline: true },
        ],
      },
    },
    { slug: 'staff', label: 'Staff', description: 'Faculty and staff directory.', fetch: { method: 'GET', path: '/api/department/staff' } },
    { slug: 'notifications', label: 'Notifications', description: 'System notifications.', fetch: { method: 'GET', path: '/api/notifications' } },
  ],
  admin: [
    { slug: 'dashboard', label: 'Dashboard', description: 'Role overview and quick access.' },
    {
      slug: 'features',
      label: 'Features',
      description: 'Admin feature management.',
      fetch: { method: 'GET', path: '/api/admin/features' },
      submit: {
        method: 'POST',
        path: '/api/admin/features',
        fields: [
          { key: 'feature_name', label: 'Feature Name', required: true },
          { key: 'feature_type', label: 'Feature Type', required: true },
          { key: 'description', label: 'Description', multiline: true },
          { key: 'target_audience', label: 'Target Audience', required: true },
          { key: 'academic_year', label: 'Academic Year', required: true },
        ],
      },
    },
    {
      slug: 'fee-structure',
      label: 'Fee Structure',
      description: 'Fee structure management.',
      fetch: { method: 'GET', path: '/api/admin/fee-structure' },
      submit: {
        method: 'POST',
        path: '/api/admin/fee-structure',
        fields: [
          { key: 'academic_year', label: 'Academic Year', required: true },
          { key: 'department_id', label: 'Department ID (optional)' },
          { key: 'structure_details', label: 'Structure Details JSON', required: true, multiline: true, isJson: true },
        ],
      },
    },
    { slug: 'login-logs', label: 'Login Logs', description: 'System login activity.', fetch: { method: 'GET', path: '/api/admin/logs' } },
    {
      slug: 'users',
      label: 'Users',
      description: 'Create users by role.',
      submit: {
        method: 'POST',
        path: '/api/admin/users',
        fields: [
          { key: 'username', label: 'Username / Email / USN', required: true },
          { key: 'password', label: 'Password', required: true },
          { key: 'role', label: 'Role (student/faculty/department/admin)', required: true },
        ],
      },
    },
    { slug: 'notifications', label: 'Notifications', description: 'System notifications.', fetch: { method: 'GET', path: '/api/notifications' } },
  ],
};

export const getModuleConfig = (role: UserRole, slug: string) =>
  modulesByRole[role].find((module) => module.slug === slug);
