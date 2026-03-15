import { AppError } from "./errorHandler.js";
const users = [
  { id: 1, name: "Admin User",   email: "admin@example.com", role: "admin",     token: "admin-token-456" },
  { id: 2, name: "Regular User", email: "user@example.com",  role: "user",      token: "user-token-123"  },
  { id: 3, name: "Moderator",    email: "mod@example.com",   role: "moderator", token: "mod-token-789"   },
]

const authenticate = (req, res, next ) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return next(new AppError("No authorization header provided", 401))
    };

    if(!authHeader.startsWith("Bearer ")) {
        return next(new AppError('Invalid format. Use: Bearer <token>', 401));
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if(!token) {
        return next(new AppError("Not authenticated", 401));
    }
    
    const user = users.find((u) => u.token === token);
    if(!user) {
        return next(new AppError("Invalid token", 401));
    }
    req.user = user;
    next();
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if(!req.user) {
            return next(new AppError("Not authenticated", 401))
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError(
                `Insufficient permissions. Required: ${roles.join(", ")}. Current: ${req.user.role}`,
                403
            ));
        }
        next();
    }
}

export {authenticate, authorize, users};
