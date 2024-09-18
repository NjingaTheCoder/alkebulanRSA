
import { Response, Request } from "express";

export const GetCsurfTokenController = (request : Request, response : Response) => {
        response.status(200).send({csrfToken : request.csrfToken()});
    
}


