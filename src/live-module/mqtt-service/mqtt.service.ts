import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { InfluxService } from 'src/influx-db/influx-db.service';
import { EventsGateway } from '../wss-event/events.gateway';
import { ConfigService } from '@nestjs/config';
import { envKeys } from 'src/config/config.keys';

@Injectable()
export class MqttService {
  private client: mqtt.MqttClient;

  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly influxService: InfluxService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const options: mqtt.IClientOptions = {
      // key: fs.readFileSync(ConfigService.get(ConfigKeys.mqttClientkey)),
      // cert: fs.readFileSync(ConfigService.get(ConfigKeys.mqttClientCert)),
      clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
      password: '>j7mQ#6NRF:8cfA$9sbW',
      username: 'hivemq.webclient.1723568803147',
      rejectUnauthorized: true,
      reconnectPeriod: 1000, // Retry connection every second
      connectTimeout: 3000, // Connection timeout
    };

    this.client = mqtt.connect(
      this.configService.get<string>(envKeys.MQTT_NODE),
      options,
    );

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe(['mazi/#']);
    });

    this.client.on('message', async (topic, message) => {
      console.log(message?.toString());

      try {
        //new live alarms

        //{"batterylevel":3, batteryID: 456789, deviceID; 789}
        const data = JSON.parse(message?.toString());
        console.log(data);

        this.influxService.writePoint(
          data?.batteryID,
          {
            batteryLevel: data?.batteryLevel,
          },
          { deviceID: data?.deviceID },
        );
      } catch (error) {
        console.log(error);
      }
    });

    this.client.on('error', (error) => {
      console.error(`MQTT Client Error: ${error.message}`);
    });
  }

  async pubishData(message: any) {
    try {
      const configMessage = JSON.stringify(message);
      const result = this.client.publish('mazi', configMessage);
      console.log('Provisioning result:', result);
      // await this.dataLoggerService.createLogger({
      //   projectUid: message?.projectID,
      //   loggerSerial: serial,
      // });
      return { message: 'success' };
    } catch (error) {
      console.error('Provisioning failed:', error);
      // throw new HttpException('Failed', HttpStatus.BAD_REQUEST);
    }
  }
}
