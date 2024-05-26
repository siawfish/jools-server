import Typesense from "typesense";
import config from ".";

const { typesense: t } = config as { typesense: { host: string, port: string, protocol: string } };

const typesense = new Typesense.Client({
  nodes: [
    {
      host: t.host,
      port: Number(t.port),
      protocol: t.protocol,
    },
  ],
  apiKey: "xyz",
  connectionTimeoutSeconds: 2,
});

export const typesenseWorkerSchema = {
  "name": "workers",
  "enable_nested_fields": true,
  "fields": [
    {
      "name": "avatar",
      "type": "string",
      "facet": false,
    },
    {
      "name": "firstName",
      "type": "string",
      "facet": false,
    },
    {
      "name": "lastName",
      "type": "string",
      "facet": false,
    },
    {
      "name": "companyName",
      "type": "string",
      "facet": false,
    },
    {
      "name": "phoneNumber",
      "type": "string",
      "facet": false,
    },
    {
      "name": "location",
      "type": "geopoint",
      "facet": true,
    },
    {
      "name": "acceptedTerms",
      "type": "object",
      "facet": false,
    },
    {
      "name": "type",
      "type": "string",
      "facet": true,
    },
    {
      "name": "documents",
      "type": "object",
      "facet": false,
    },
    {
      "name": "email",
      "type": "string",
      "facet": false,
    },
    {
      "name": "skills",
      "type": "string[]",
      "facet": true,
    },
    {
      "name": "score",
      "type": "int32",
      "facet": true,
    },
    {
      "name": "rating",
      "type": "int32",
      "facet": true,
    },
    {
      "name": "pushToken",
      "type": "string",
      "facet": false,
    },
    {
      "name": "workingHours",
      "type": "object[]",
      "facet": false,
    },
    {
      "name": "id",
      "type": "string",
      "facet": false,
    },
    {
      "name": "properties",
      "type": "object[]",
      "facet": false,
    },
  ],
  'default_sorting_field': 'rating'
};
export default typesense;
