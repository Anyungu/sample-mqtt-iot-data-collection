import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MqttService } from '../mqtt-service/mqtt.service';

@Injectable()
export class TasksService {
  constructor(private readonly mqttService: MqttService) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    this.logger.debug('Called every 30 seconds');
    const data = this.generateBatteryData();
    this.mqttService.pubishData(data);
  }

  private generateBatteryData() {
    const batteryLevel = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const batteryID =
      Math.floor(Math.random() * (510000 - 500000 + 1)) + 500000; // Random number between 500000 and 510000
    const deviceID = Math.floor(Math.random() * (999 - 100 + 1)) + 100; // Random number between 100 and 999

    return {
      batteryLevel,
      batteryID,
      deviceID,
    };
  }
}
