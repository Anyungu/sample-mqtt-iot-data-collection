import { Module } from '@nestjs/common';
import { InfluxService } from './influx-db.service';
import { ConfigModule } from '@nestjs/config';
import influxConfig from 'src/config/influx.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [influxConfig],
    }),
  ],
  providers: [InfluxService],
  exports: [InfluxService],
})
export class InfluxDbModule {}
