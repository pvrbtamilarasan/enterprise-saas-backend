// src/tenant/tenant.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get tenant identifier from header, subdomain, or token
      let tenantId = req.headers['x-tenant-id'] as string;
      
      // If not in header, try to extract from hostname (subdomain)
      if (!tenantId && req.hostname) {
        const subdomain = req.hostname.split('.')[0];
        if (subdomain !== 'www' && subdomain !== 'localhost') {
          const tenant = await this.tenantService.findBySubdomain(subdomain);
          if (tenant) {
            tenantId = tenant.id;
          }
        }
      }
      
      // Set default if no tenant found
      if (!tenantId) {
        tenantId = 'default';
      }
      
      // Attach tenant ID to request object
      req['tenantId'] = tenantId;
    } catch (error) {
      req['tenantId'] = 'default';
    }
    
    next();
  }
}