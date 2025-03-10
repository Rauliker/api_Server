import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthorizationMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  private readonly logger = new Logger(AuthorizationMiddleware.name); // Added logger instance

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    const isPublicRoute = (req.method === 'POST' && (req.path === '/users' || req.path === '/users/login'));

    if (!token && !isPublicRoute) {
      throw new UnauthorizedException('Token not provided');
    }

    if (token) {
      try {
        const decoded = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
      } catch (error) {
        // this.logger.error('Token verification failed', error.message);
        
        // console.log("token ", error)
        throw new UnauthorizedException('Invalid token');
      }
    }
    
    next();
  }
}
