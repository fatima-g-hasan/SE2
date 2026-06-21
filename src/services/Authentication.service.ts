import config from '../config';
import { UserPayload } from '../config/types';
import jwt from 'jsonwebtoken';
import { InvalidTokenException, TokenExpiredException } from '../util/exceptions/http/AuthenticationException';
import { ServiceException } from '../util/exceptions/http/ServiceException';
import logger from '../util/logger';
import { Response } from 'express';
import ms from 'ms';

export class AuthenticationService {

  constructor(
    private secretKey = config.auth.secretKey,
    private tokenExpiration = config.auth.tokenExpiration,
    private refreshTokenExpiration = config.auth.refreshTokenExpiration,
  ) {}

  generateToken(payload: UserPayload): string {
    return jwt.sign(
        payload,
        this.secretKey,
        {expiresIn: this.tokenExpiration}
      );
  }

  generateRefreshToken(payload: UserPayload): string {
    return jwt.sign(
      payload,
      this.secretKey,
      {expiresIn: this.refreshTokenExpiration}
    )
  }

  verify(token: string): UserPayload {
    try {
      return jwt.verify(token, this.secretKey) as UserPayload;
    } catch (error) {
      logger.error('Token verification failed', error);
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredException();
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new InvalidTokenException ();
      }
      throw new ServiceException('Token verfication failed');
    }
  }

  refreshToken(refreshToken: string) {
    const payload = this.verify(refreshToken);
    if (!payload) {
      throw new InvalidTokenException();
    }
    return this.generateToken(payload);
  }

  setTokenIntoCookie(res: Response, token: string) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.isProduction,
      maxAge: ms(this.tokenExpiration)
    })
  }

  setRefreshTokenIntoCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.isProduction,
      maxAge: ms(this.refreshTokenExpiration)
    })
  }

  clearTokens(res: Response) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
  }

  
    persistAuthentication(res:Response, payload: UserPayload) {
      const token = this.generateToken(payload);
      const refreshToken = this.generateRefreshToken(payload);
      this.setTokenIntoCookie(res, token);
      this.setRefreshTokenIntoCookie(res, refreshToken);
    }
}