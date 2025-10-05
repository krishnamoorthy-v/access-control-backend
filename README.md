🖥️ Backend – Node.js + Express + Redis

This backend handles user authentication and session management securely using Redis. It serves APIs to provide user information to the frontend, without storing sensitive data on the client.

🌟 Features
    
    🔐 Session-based authentication using Express sessions.
    
    🗄️ Redis session store for fast, secure, and scalable session management.
    
    ⚡ Role-based user data returned for frontend display (admin/user).
    
    🌐 RESTful APIs to fetch user information based on session.
    
    ✅ No local storage or JWT required — session-driven flow.
    
    💡 Easily integrates with React Context on the frontend.

🛠 Tech Stack

    Node.js – Server runtime
    
    Express.js – Web framework
    
    Redis – In-memory session storage
    
    express-session – Session middleware
    
    cors – Cross-origin requests
    
    dotenv – Environment variable management

🔍 How It Works

  User login:
  
    User submits credentials to /login API.
    
    Backend validates credentials and creates a session stored in Redis.
  
  Session management:
  
    Each session gets a unique session ID.
    
    Redis stores session data securely (e.g., user info, role).
    
    The session ID is sent as a cookie to the frontend.
  
  Fetching user info:
  
    Frontend calls /me endpoint using Axios.
    
    Backend retrieves user data from the session in Redis and returns it.
    
    React Context updates the frontend state.
    
  Logout:
  
    Backend destroys the session in Redis.
    
    Frontend clears user context automatically.
