import 'dotenv/config';
import { CodegenConfig } from '@graphql-codegen/cli';
import * as assert from 'assert';

assert(process.env.CUBE_ENDPOINT, 'Missing CUBE_ENDPOINT');
assert(process.env.CUBE_KEY, 'Missing CUBE_KEY');

const config: CodegenConfig = {
  schema: [
    {
      [process.env.CUBE_ENDPOINT || '']: {
        headers: {
          Authorization: process.env.CUBE_KEY || '',
        },
      },
    },
  ],
  generates: {
    'src/modules/cube/schema.generated.ts': {
      documents: ['src/modules/cube/queries/*.graphql'],
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
    },
  },
};

export default config;
