# UniVerse Backend - Spring Boot Application

## How to Run the Backend

### Prerequisites
1. **Java 17** or higher installed
2. **Maven** installed (or use mvnw wrapper included)
3. **MySQL** database running

### Setup Steps

#### Step 1: Setup MySQL Database
```sql
-- Open MySQL Workbench or command line
CREATE DATABASE universe_db;
USE universe_db;

-- Run the schema from src/main/resources/schema.sql
```

#### Step 2: Configure Database Connection
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

#### Step 3: Configure Stripe Credentials
⚠️ **IMPORTANT: Required for Payment Functionality**

```bash
# Set environment variables
$env:STRIPE_API_KEY = "sk_test_your_key_from_stripe_dashboard"
$env:STRIPE_WEBHOOK_SECRET = "whsec_your_signing_secret"
```

For detailed setup instructions, see [STRIPE_SETUP_ENV_FIX.md](./STRIPE_SETUP_ENV_FIX.md)

#### Step 4: Build and Run
```bash
# Navigate to backend folder
cd backend

# Option 1: Use PowerShell startup script (Recommended)
.\run-backend.ps1

# Option 2: Use Maven directly (with env vars set)
mvn spring-boot:run

# Option 3: Use Maven wrapper (no Maven installation needed)
./mvnw spring-boot:run     # Linux/Mac
mvnw.cmd spring-boot:run   # Windows

# Option 4: Run compiled JAR (must build first: mvn package)
java -jar target/universe-backend-1.0.0.jar
```

The backend will start on **http://localhost:8081**

### Testing the API

#### Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@university.edu","password":"password123","firstName":"John","lastName":"Doe","role":"STUDENT"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@university.edu","password":"password123"}'
```

#### Test Clubs
```bash
# Get all clubs
curl http://localhost:8080/api/clubs

# Get club by ID
curl http://localhost:8080/api/clubs/1
```

### API Documentation
- Base URL: `http://localhost:8080/api`
- Authentication: `/api/auth/**`
- Clubs: `/api/clubs/**`
- Events: `/api/events/**`
- Memberships: `/api/memberships/**`
- Admin: `/api/admin/**`

### Common Issues

**Problem: "Stripe API key is not properly configured"**
- Cause: Environment variables not set
- Solution: Set `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET` environment variables
- See [STRIPE_SETUP_ENV_FIX.md](./STRIPE_SETUP_ENV_FIX.md) for detailed instructions

**Problem: "Communications link failure"**
- Solution: Make sure MySQL is running

**Problem: "Access denied for user"**
- Solution: Check username/password in application.properties

**Problem: "Table doesn't exist"**
- Solution: Run schema.sql in MySQL

**Problem: "HTTP 400 error in payment flow"**
- Cause: Usually Stripe configuration issue
- Solution: See [STRIPE_SETUP_ENV_FIX.md](./STRIPE_SETUP_ENV_FIX.md)

### Project Structure
```
backend/
├── src/main/java/com/university/universe/
│   ├── UniverseApplication.java      # Main entry point
│   ├── model/                        # Database entities
│   ├── repository/                   # Data access
│   ├── service/                      # Business logic
│   ├── controller/                   # REST APIs
│   └── config/                       # Configuration
├── src/main/resources/
│   ├── application.properties        # Configuration
│   └── schema.sql                    # Database schema
└── pom.xml                           # Maven dependencies
```

### Dependencies Used
- Spring Boot Web: RESTful APIs
- Spring Data JPA: Database access
- MySQL Connector: MySQL driver
- Spring Security: Authentication & authorization
- JWT (jjwt): Token generation

### For Team Members
Each team member should:
1. Clone the repository
2. Setup MySQL locally with same schema
3. Update application.properties with their MySQL password
4. Run the backend before testing their features

---
Created for UniVerse University Club Management System
