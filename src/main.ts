import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Tenant } from './tenant/entities/tenant.entity';
import { License } from './licensing/entities/license.entity';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable body parser explicitly (optional in NestJS)
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // ✅ Enable CORS
  app.enableCors();

  // ✅ Seed database
  try {
    const dataSource = app.get(DataSource);
    const tenantRepository = dataSource.getRepository(Tenant);

    const count = await tenantRepository.count();
    if (count === 0) {
      const defaultTenant = await tenantRepository.save({
        name: 'Default Tenant',
        subdomain: 'default',
        isActive: true,
        settings: {
          theme: 'light',
          modules: ['dashboard', 'hcm', 'finance'],
        },
      });

      const testTenant = await tenantRepository.save({
        name: 'Test Tenant',
        subdomain: 'test',
        isActive: true,
        settings: {
          theme: 'dark',
          modules: ['dashboard'],
        },
      });

      const licenseRepository = dataSource.getRepository(License);
      await licenseRepository.save({
        tenantId: defaultTenant.id,
        enabledModules: ['dashboard', 'hcm', 'finance'],
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });

      await licenseRepository.save({
        tenantId: testTenant.id,
        enabledModules: ['dashboard'],
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      console.log('Database seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
