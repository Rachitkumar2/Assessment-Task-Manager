# Team Task Manager

A full-stack project management application with role-based access control.

##  Tech Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** 
- **React Router Dom** 
- **Axios** 

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** 
- **JWT** 
- **Bcrypt.js** 
- **CORS** 

---

## API Routes

### Authentication (`/api/auth`)
- `POST /register` - Create new user with role (Admin/Member)
- `POST /login` - User login (returns JWT)
- `GET /me` - Get current authenticated user details

### Projects (`/api/projects`)
- `POST /` - Create new project (Admin only)
- `GET /` - List all projects user is a member of
- `GET /:id` - Get specific project details
- `PATCH /:id` - Update project details (Admin only)
- `DELETE /:id` - Delete project and all its tasks (Admin only)
- `POST /:id/members` - Add member to project (Admin only)
- `DELETE /:id/members/:userId` - Remove member from project (Admin only)

### Tasks (`/api/projects/:projectId/tasks`)
- `POST /` - Create task (Admin only)
- `GET /` - List all tasks in a project
- `GET /:id` - Get single task details
- `PATCH /:id` - Update task (Admin: all fields, Member: status only)
- `DELETE /:id` - Delete task (Admin only)

### Dashboard (`/api/dashboard`)
- `GET /` - Get aggregated stats (task counts, overdue tasks, project overview)

---

##  Role-Based Access Control (RBAC)

### Admin
- Create and manage projects
- Add or remove team members
- Create, edit, and delete any task in their projects
- Full visibility into project progress

### Member
- View projects they are invited to
- View tasks within their projects
- **Update status** (To Do, In Progress, Done) for tasks assigned to them
- Restricted from creating or deleting projects/tasks
