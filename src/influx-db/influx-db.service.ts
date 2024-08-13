import { Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { ConfigService } from '@nestjs/config';
import { envKeys } from 'src/config/config.keys';

@Injectable()
export class InfluxService {
  private influxDB: InfluxDB;
  private writeApi: ReturnType<InfluxDB['getWriteApi']>;
  private queryApi: ReturnType<InfluxDB['getQueryApi']>;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>(envKeys.INFLUX_TOKEN);
    const url = this.configService.get<string>(envKeys.INFLUX_URL);
    const bucket = this.configService.get<string>(envKeys.INFLUX_BUCKET);
    const org = this.configService.get<string>(envKeys.INFLUX_ORG);
    this.influxDB = new InfluxDB({ url, token });
    this.writeApi = this.influxDB.getWriteApi(org, bucket);
    this.queryApi = this.influxDB.getQueryApi(org);
  }

  async writePoint(
    measurement: string,
    fields: Record<string, any>,
    tags?: Record<string, string>,
  ) {
    try {
      const point = new Point(measurement);
      Object.keys(fields).forEach((field) => {
        point.floatField(field, fields[field]);
      });
      if (tags) {
        Object.keys(tags).forEach((tag) => {
          point.tag(tag, tags[tag]);
        });
      }
      this.writeApi.writePoint(point);
      await this.writeApi.flush();
    } catch (error) {
      console.log(error);
    }
  }

  async query(query: string) {
    return this.queryApi.collectRows(query);
  }
}
