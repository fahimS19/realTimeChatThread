import type { Response, Request, NextFunction } from "express";
import { clerkMiddleware, getAuth, clerkClient } from "@clerk/express";
import { UnAuthorizedError } from "../lib/errors.js";
export { clerkMiddleware, getAuth, clerkClient };
export function requireAuthApi(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const auth = getAuth(req);
  if (!auth.userId) {
    return next(
      new UnAuthorizedError("You must be signed in to access this resource")
    );
  }
}
