# Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web Browser                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Application (Vite)                    │   │
│  │                                                           │   │
│  │  ┌────────────────┐  ┌────────────────┐                │   │
│  │  │   Components   │  │  Pages/Tabs    │                │   │
│  │  │                │  │                │                │   │
│  │  │  - Sidebar     │  │ - LoginPage    │                │   │
│  │  │  - Dashboard   │  │ - Dashboard    │                │   │
│  │  │  - Cards       │  │ - Admin Panel  │                │   │
│  │  │  - Forms       │  │ - Profile      │                │   │
│  │  └────────────────┘  └────────────────┘                │   │
│  │         ↓                                               │   │
│  │  ┌────────────────────────────────────┐                │   │
│  │  │    React Context (Auth/State)      │                │   │
│  │  │                                    │                │   │
│  │  │  - AuthProvider                    │                │   │
│  │  │  - useAuth() hook                  │                │   │
│  │  │  - User session management         │                │   │
│  │  │  - Account verification            │                │   │
│  │  └────────────────────────────────────┘                │   │
│  │         ↓                                               │   │
│  │  ┌────────────────────────────────────┐                │   │
│  │  │   Data Layer (localStorage)        │                │   │
│  │  │                                    │                │   │
│  │  │  - User sessions: zf_user         │                │   │
│  │  │  - Accounts: zf_accounts          │                │   │
│  │  │  - Signup temp: zf_signup_temp    │                │   │
│  │  │  - Mock loans data                │                │   │
│  │  └────────────────────────────────────┘                │   │
│  │                                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    Browser localStorage                         │
│  (Persistent across sessions, ~5-10MB available)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Optional: Google Sheets API                                     │
│  (For cloud data sync - not currently enabled)                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure & Module Organization

### Core Application Structure

```
src/
├── App.tsx                    # Main app component with routing
├── App.css                    # Global app styles
├── index.css                  # Base CSS variables and global styles
├── main.tsx                   # Application entry point
│
├── components/                # Reusable React components
│   ├── tabs/                 # Page-level components (containers)
│   │   ├── Dashboard.tsx       # Dashboard page
│   │   ├── Dashboard.css       # Dashboard styles
│   │   ├── LoginPage.tsx       # Login/signup page
│   │   ├── LoginPage.css
│   │   ├── OtpVerify.tsx       # OTP verification
│   │   ├── Admin.tsx           # Admin dashboard
│   │   ├── Admin.css
│   │   ├── Apply.tsx           # Loan application
│   │   ├── Apply.css
│   │   ├── Loans.tsx           # Loans management
│   │   ├── Loans.css
│   │   ├── Payments.tsx        # Payments page
│   │   ├── Payments.css
│   │   ├── Profile.tsx         # User profile
│   │   ├── Profile.css
│   │   ├── Overview.tsx        # Financial overview
│   │   ├── Overview.css
│   │   ├── Aurora.tsx          # Aurora background animation
│   │   ├── Aurora.css
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── Sidebar.css
│   │   ├── formatters.ts       # Data formatting utilities
│   │   └── OtpVerify.tsx
│   │
│   └── [other components]
│
├── context/                   # React Context for state management
│   └── AuthContext.tsx        # Authentication context
│       - Provides: user, isAuthenticated, isSignupFlow
│       - Methods: login, createAccount, verifyOtp, logout
│       - Data: phone number, signup data, signup temp
│
├── data/                      # Application data
│   └── mockData.ts           # Mock user, loans, transactions
│
├── types/                     # TypeScript type definitions
│   └── index.ts              # All interface definitions
│       - User
│       - Loan
│       - Transaction
│       - Notification
│
├── styles/                    # Global styles
│   └── animations.css        # Keyframe animations and transitions
│
└── assets/                    # Image and asset files
```

---

## Component Architecture

### Page Component Hierarchy

```
App (Router Setup)
├── Routes
│   ├── /login → LoginPage
│   │   ├── Aurora (background)
│   │   ├── Login Form OR Signup Form (toggled)
│   │   └── OtpVerifyFlow (conditional)
│   │
│   ├── / → ProtectedRoute
│   │   └── Dashboard
│   │       ├── Sidebar
│   │       │   ├── Navigation Links
│   │       │   └── User Avatar
│   │       └── Main Content
│   │           ├── Header (with greeting)
│   │           ├── Dashboard Tabs
│   │           │   ├── Home (default)
│   │           │   ├── Loans
│   │           │   ├── Payments
│   │           │   ├── Apply
│   │           │   └── Profile
│   │           └── Content Area
│   │               └── Tab-specific components
│   │
│   └── /admin → AdminRoute
│       └── Dashboard (Admin version)
│           └── Admin-specific panels
```

### Component Communication Pattern

```
LoginPage
  ├── Input: authContext.createAccount()
  │   └── States: [phone, email, name, pin, pin_confirm]
  │   └── Output: Account created in localStorage
  │
  ├── Display: OtpVerifyFlow (when isSignupFlow = true)
  │   ├── Input: authContext.verifyOtp()
  │   └── Output: Account verified, auto-login triggered
  │
  └── Navigation: useNavigate() to dashboard on success

Dashboard
  ├── Sidebar
  │   ├── Gets: user from useAuth()
  │   ├── State: isCollapsed (local)
  │   └── OnClick: toggleCollapsed, navigate to tabs
  │
  ├── Tabs (Always rendered)
  │   ├── State: activeTab (local component state)
  │   ├── Each Tab Component
  │   │   ├── Gets: loan data from mockData
  │   │   ├── Gets: user from useAuth()
  │   │   └── Displays: filtered/formatted data
  │   │
  │   └── Tab Switch: onClick handler updates activeTab
  │
  └── Header
      ├── Gets: user.name from useAuth()
      └── Shows: greeting + current date
```

---

## State Management Architecture

### Authentication State (React Context)

```typescript
type AuthContextType = {
  // Current state
  user: User | null;                    // Logged-in user
  isAuthenticated: boolean;              // Auth status
  isInitializing: boolean;               // Loading state
  phoneNumber: string | null;            // Current phone
  signupData: SignupData | null;        // Temp signup data
  isSignupFlow: boolean;                 // In OTP verification?
  
  // Actions
  createAccount: (phone, email, name, pin) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  completeSignup: () => void;
  login: (phone, pin) => Promise<boolean>;
  logout: () => void;
  resetSignupFlow: () => void;
}
```

### Data Flow

```
User Input (LoginPage)
  ↓
  createAccount() OR login()
  ↓
  Validate input
  ↓
  Check localStorage (zf_accounts)
  ↓
  Create/Update account
  ↓
  Save temp data to localStorage (zf_signup_temp)
  ↓
  Update isSignupFlow state
  ↓
  Component renders OTP page
  ↓
  verifyOtp() called
  ↓
  completeSignup() called
  ↓
  Create User object
  ↓
  Save to localStorage (zf_user) with loginTime
  ↓
  useEffect in LoginPage triggers navigation
  ↓
  Redirect to Dashboard
```

---

## Data Storage Architecture

### localStorage Keys & Structure

#### 1. User Session (zf_user)
```javascript
{
  id: "USR-a1b2c3d4e5f6",            // Unique user ID
  name: "Peter Nzambi",               // Full name
  email: "peter@example.com",         // Email
  phone: "+260912345678",             // Phone number
  accountNumber: "ZM-ABC123DEF",      // Unique account number
  creditScore: 650,                   // 650=new, 720=existing, 850=admin
  role: "client" | "admin",           // User role
  loginTime: 1718736000000            // Timestamp for session expiry
}
```

**Expiry Logic**: 24 hours from `loginTime`  
**Storage Key**: `zf_user`  
**Lifetime**: Until logout or session expires

#### 2. Registered Accounts (zf_accounts)
```javascript
[
  {
    phone: "+260912345678",           // Unique identifier
    email: "peter@example.com",
    name: "Peter Nzambi",
    accountNumber: "ZM-ABC123DEF",
    pin: "2222",                      // 4-digit PIN (plaintext for dev)
    verified: true                    // OTP verified?
  },
  // ... more accounts
]
```

**Storage Key**: `zf_accounts`  
**Persistence**: Permanent (only cleared on localStorage.clear())  
**Usage**: Login verification, duplicate prevention

#### 3. Signup Temporary Data (zf_signup_temp)
```javascript
{
  phone: "+260912345678",
  email: "peter@example.com",
  name: "Peter Nzambi",
  accountNumber: "ZM-ABC123DEF",
  pin: "2222",
  verified: false                     // Updated to true after OTP
}
```

**Storage Key**: `zf_signup_temp`  
**Lifetime**: During signup->OTP flow, cleared on completion  
**Purpose**: Persist signup data across page navigations

### Mock Data (In-Memory)
```javascript
// Never persisted, loaded on each page refresh
mockUser                    // Fallback user data
mockNotifications[]         // Notification list
mockLoans[]                 // Sample loans with statuses
mockTransactions[]          // Sample transactions
```

---

## Routing Architecture

### Route Structure (React Router v6)

```
/
├── /login (public)
│   └── Components: LoginPage with OtpVerifyFlow
│
├── / (protected, client)
│   └── ProtectedRoute → Dashboard
│       └── Renders: Sidebar + Tabs + Content
│
├── /admin (protected, admin only)
│   └── AdminRoute → Dashboard (admin version)
│       └── Renders: Admin-specific dashboard
│
├── /verify (public, during signup)
│   └── OtpVerify (part of LoginPage flow)
│
└── /* (catch-all)
    └── Redirect to /
```

### Navigation Guards

1. **ProtectedRoute** - Redirects unauthenticated to `/login`
2. **AdminRoute** - Redirects non-admins to `/`
3. **LoginPage** - Redirects authenticated users to `/ or /admin`

---

## Authentication Flow Diagram

### Login Flow
```
[LoginPage]
    ↓
[Enter Phone + PIN]
    ↓
[Click "Sign In"]
    ↓
[login() context method]
    ↓
[Check: account exists in zf_accounts?]
    ├─ NO → Error: "Account not found"
    │
    └─ YES → [Check: account verified?]
        ├─ NO → Error: "Account not verified"
        │
        └─ YES → [Check: PIN matches?]
            ├─ NO → Error: "Invalid PIN"
            │
            └─ YES → [Create User from account]
                ↓
            [Save to zf_user with loginTime]
                ↓
            [useEffect detects isAuthenticated = true]
                ↓
            [navigate() to "/" or "/admin"]
                ↓
            [Dashboard loads]
```

### Signup Flow
```
[LoginPage]
    ↓
[Click "Create Account"]
    ↓
[Show Signup Form]
    ↓
[Enter: Name, Phone, Email, PIN, PIN_Confirm]
    ↓
[Click "Create Account"]
    ↓
[createAccount() context method]
    ↓
[Validate all fields]
    ├─ Invalid → Show error
    │
    └─ Valid → [Check: phone not in zf_accounts?]
        ├─ Exists → Error: "Account exists"
        │
        └─ New → [Create SignupData]
            ↓
        [Save to zf_signup_temp]
            ↓
        [Set isSignupFlow = true]
            ↓
        [navigate() to "/verify"]
            ↓
        [OtpVerifyFlow component shows]
            ↓
        [User enters 6-digit OTP]
            ↓
        [verifyOtp() context method]
            ↓
        [Mark account as verified in zf_signup_temp]
            ↓
        [Move account to zf_accounts]
            ↓
        [completeSignup() called]
            ↓
        [Create User object]
            ↓
        [Save to zf_user with loginTime]
            ↓
        [useEffect detects isAuthenticated = true]
            ↓
        [navigate() to "/"]
            ↓
        [Dashboard loads]
```

---

## Component Lifecycle & Rendering

### Dashboard Lifecycle
```
<Dashboard>
  ├── [Mount]
  ├── State: activeTab = 'home'
  ├── Gets: user from useAuth()
  ├── Gets: loans from mockData
  │
  ├── [Render Function]
  │   ├── <Sidebar>
  │   │   ├── Maps over nav items
  │   │   └── Renders: <button onClick={() => setActiveTab()}>
  │   │
  │   ├── <Header>
  │   │   ├── Shows: user greeting
  │   │   └── Renders: logout button
  │   │
  │   └── [Tab Content]
  │       ├── switch(activeTab) {
  │       │   case 'home': return <Overview>
  │       │   case 'loans': return <Loans>
  │       │   case 'payments': return <Payments>
  │       │   ...
  │       │ }
  │       │
  │       └── Tab Component
  │           ├── Receives: loans, user props OR gets from mock
  │           ├── Maps: loans.map(loan => <LoanCard>)
  │           └── Renders: formatted data
  │
  └── [Updates]
      ├── Click sidebar button → setActiveTab() → re-render
      ├── Click logout → logout() context → navigate to /login
      └── Window resize → CSS media queries handle responsive
```

---

## Error Handling Strategy

### Authentication Errors
```
Invalid Phone/PIN
  ↓
login() returns false
  ↓
setError() updates local state
  ↓
Render <div className="error-msg">
```

### Account Creation Errors
```
Duplicate Account
  ↓
createAccount() returns false
  ↓
setError("Account with this phone number already exists")
  ↓
Form stays visible with error message
```

### Network Errors (Future)
```
API Call Fails
  ↓
Catch block → setError()
  ↓
Show error toast or modal
  ↓
User can retry
```

---

## Performance Considerations

### Code Splitting
- Each route bundled separately in production
- Lazy loading components (React.lazy + Suspense)
- CSS files loaded only when needed

### Rendering Optimization
- useCallback for handleSubmit functions
- useMemo for computed values
- Re-render only affected components

### Data Fetching
- Mock data loaded synchronously (no API calls)
- localStorage read on app start
- Session validation on page load

---

## Scalability Patterns (Future)

### When Moving to Backend

1. **Replace localStorage with API calls**
   ```typescript
   // Before (localStorage)
   const account = localStorage.getItem('zf_accounts');
   
   // After (API)
   const account = await api.get('/api/accounts/:phone');
   ```

2. **Add caching layer**
   ```typescript
   const [cache, setCache] = useState({});
   if (cache[key]) return cache[key];
   const data = await api.get(url);
   setCache({ ...cache, [key]: data });
   ```

3. **Implement error retry logic**
   ```typescript
   async function apiWithRetry(fn, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
       }
     }
   }
   ```

---

## Testing Architecture

### Unit Testing (Components)
```typescript
// Test component rendering
render(<LoginPage />);
expect(screen.getByText('Secure Access')).toBeInTheDocument();

// Test user interactions
fireEvent.change(inputElement, { target: { value: '+260...' } });
fireEvent.click(submitButton);
expect(mockLogin).toHaveBeenCalledWith('+260...');
```

### Integration Testing (Flows)
```typescript
// Test full signup flow
1. Render LoginPage
2. Click "Create Account"
3. Fill form
4. Click "Create Account"
5. Verify localStorage has signup data
6. Verify redirect to /verify
7. Enter OTP
8. Verify localStorage has account added
9. Verify redirect to /
```

### E2E Testing (User Journeys)
```typescript
// Test using Cypress or Playwright
cy.visit('localhost:5173/login');
cy.contains('Create Account').click();
cy.get('input[placeholder="John Doe"]').type('Jane Doe');
cy.get('input[placeholder="+260..."]').type('+260987654321');
// ... complete flow
cy.url().should('eq', 'http://localhost:5173/');
```

---

## Future Architecture Improvements

1. **Redux/Zustand** - For more complex state management
2. **GraphQL** - Type-safe API queries instead of REST
3. **WebSockets** - Real-time notifications and data sync
4. **Service Workers** - Offline support and caching
5. **Storybook** - Component documentation and testing
6. **Testing Library** - Comprehensive unit and integration tests
7. **Error Boundary** - Graceful error handling
8. **Analytics** - Track user behavior and performance

