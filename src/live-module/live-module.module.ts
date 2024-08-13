import { Module } from '@nestjs/common';
import { MqttService } from './mqtt-service/mqtt.service';
import { EventsGateway } from './wss-event/events.gateway';
import { InfluxDbModule } from 'src/influx-db/influx-db.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './task/task.service';

@Module({
  imports: [InfluxDbModule, ConfigModule, ScheduleModule.forRoot()],
  providers: [MqttService, EventsGateway, TasksService],
})
export class LiveModuleModule {}
