import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'

import dotenv from 'dotenv'

dotenv.config()

const KUBB_ENV = process.env.KUBB_ENV

const baseURL = !KUBB_ENV
  ? 'https://api.indexcoop.com'
  : KUBB_ENV === 'local'
    ? 'http://127.0.0.1:4000'
    : KUBB_ENV

const config = defineConfig({
  root: '.',
  input: {
    path: !KUBB_ENV
      ? `${baseURL}/v2/docs/json`
      : KUBB_ENV === 'local'
        ? `${baseURL}/documentation/json`
        : `${baseURL}/documentation/json`,
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
      baseURL,
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
