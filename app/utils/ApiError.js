
class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = []) {
        super(message); // Call the parent Error constructor with the message
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        this.errors = errors; 
    }
}

export default ApiError;