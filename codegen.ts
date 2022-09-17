import 'dotenv/config';
import { CodegenConfig } from '@graphql-codegen/cli';

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
