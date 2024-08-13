// Database configuration
import { registerAs } from '@nestjs/config';

export default registerAs('influx', () => ({
  url: process.env.INFLUX_URL || 'http://localhost:8086',
  token: process.env.INFLUX_TOKEN || 'your-token',
  org: process.env.INFLUX_ORG || 'your-org',
  bucket: process.env.INFLUX_BUCKET || 'your-bucket',
}));
