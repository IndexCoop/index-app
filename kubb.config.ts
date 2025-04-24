import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'

import dotenv from 'dotenv'

dotenv.config()

const isLocal = process.env.KUBB_ENV === 'local'

const config = defineConfig({
  root: '.',
  input: {
    path: isLocal
      ? 'http://127.0.0.1:4000/documentation/json' // Requires the indexcoop-api to be running locally
      : 'https://api-pr-84-jgf4.onrender.com/documentation/json',
  },
  output: {
    path: './src/gen',
    clean: true,
  },
  plugins: [
    pluginOas({
      generators: [],
    }),
    pluginTs({
      output: {
        path: 'models',
        barrelType: 'propagate',
        banner: `/* eslint-disable */`,
      },
      exclude: [
        {
          type: 'tag',
          pattern: 'admin',
        },
      ],
      group: {
        type: 'tag',
      },
      enumType: 'asConst',
      dateType: 'date',
    }),
    pluginClient({
      baseURL: isLocal
        ? 'http://127.0.0.1:4000' // Requires the indexcoop-api to be running locally
        : 'https://api-pr-84-jgf4.onrender.com',
      output: {
        path: './clients/axios',
        barrelType: 'propagate',
        banner: `/* eslint-disable */`,
      },
      exclude: [
        {
          type: 'tag',
          pattern: 'admin',
        },
      ],
      importPath: '@/lib/axios',
      group: {
        type: 'tag',
        name({ group }) {
          return `${group}Service`
        },
      },
      operations: true,
      pathParamsType: 'object',
      dataReturnType: 'full',
    }),
    // pluginTanstackQuery({
    //   output: {
    //     path: './hooks',
    //   },
    //   framework: 'react',
    //   dataReturnType: 'full',
    // }),
  ],
})

export default defineConfig(config)
