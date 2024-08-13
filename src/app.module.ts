import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LiveModuleModule } from './live-module/live-module.module';
import { InfluxDbModule } from './influx-db/influx-db.module';

@Module({
  imports: [LiveModuleModule, InfluxDbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
