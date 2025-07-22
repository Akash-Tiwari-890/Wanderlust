class ExpressError extends Error{
    constructor(status , message){
        super();
        this.status = status; //Setting the status code
        this.message = message; //Setting the error message
    }
}
module.exports=ExpressError;