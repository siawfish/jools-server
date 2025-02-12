import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { drizzle } from 'drizzle-orm/aws-data-api/pg';

const client = new RDSDataClient({ region: process.env.AWS_REGION });

export const db = drizzle(client, {
  secretArn: process.env.DB_SECRET_ARN!,
  resourceArn: process.env.DB_CLUSTER_ARN!,
  database: process.env.DB_NAME!,
});