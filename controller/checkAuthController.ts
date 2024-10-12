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
        if(request.session?.guestCart?.userId || false){
            return response.status(210).send({ userSession : request.session.guestCart?.userId });
        }
        return response.status(401).send({ message: 'User is not authenticated' });
    }
}