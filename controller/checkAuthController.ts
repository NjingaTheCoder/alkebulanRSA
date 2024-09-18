import { Request, Response, request, response } from 'express';




export const CheckAuth = ( request : Request , response : Response) => {


    const isAuth = request.session.userData?.isAuthenticated || false;
    if (isAuth) {
        return response.status(200).send({ message: 'User is authenticated' });
    } else {
        return response.status(401).send({ message: 'User is not authenticated' });
    }
    
}

export const CheckAuthAndReturnSession = ( request : Request , response : Response) => {

    const isAuth = request.session.userData?.isAuthenticated || false;
    if (isAuth) {
        return response.status(200).send({ userSession : request.session.userData });
    } else {
        return response.status(401).send({ message: 'User is not authenticated' });
    }
}