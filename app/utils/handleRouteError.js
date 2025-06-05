import { NextResponse } from 'next/server';
import ApiError from './ApiError'; // Adjust path

/**
 *
 * @param {Function} handler - The async function that contains your route logic.
 * @returns {Function} An async function that wraps the handler with error handling.
 */
const handleRouteError = (handler) => async (request, context) => {
    try {
        // Execute the actual route handler logic
        return await handler(request, context);
    } catch (err) {
        let statusCode = 500;
        let message = "Internal Server Error";
        let errors = [];

        if (err instanceof ApiError) {
            statusCode = err.statusCode;
            message = err.message;
            errors = err.errors;
        } else {
            console.error("Unexpected server error:", err);
        }

        // Return a JSON response with the error details
        return NextResponse.json(
            {
                success: false,
                message: message,
                errors: errors,
            },
            { status: statusCode }
        );
    }
};

export default handleRouteError;