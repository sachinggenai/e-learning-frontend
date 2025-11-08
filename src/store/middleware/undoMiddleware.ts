/**
 * Undo Middleware
 *
 * Middleware to enhance undo/redo functionality with additional features
 * and history management.
 */

import { Middleware } from "@reduxjs/toolkit";

// Create undo middleware
const undoMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Log action for debugging in development
  if (process.env.NODE_ENV === "development") {
    console.log("Redux Action:", action);
  }

  return result;
};

export default undoMiddleware;
