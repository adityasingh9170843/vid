import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(){
        return NextResponse.next()
    },
    {
        callbacks:{
            authorized({req,token}){
                const {pathname} = req.nextUrl
                if(pathname.includes('/api/auth') || pathname === '/login' || pathname === '/register'){
                    return true
                }
                
                if(pathname === '/' || pathname === '/api/videos'){
                    return true
                }
                   
                return !!token
                
                
            }
        }
    }
)

export const config = {matcher: ['/','/login','/register','/api/videos']} 