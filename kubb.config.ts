import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import dotenv from 'dotenv'

dotenv.config()

// DO NOT MERGE THIS PR, IT IS ONLY FOR TESTING PURPOSES
const baseURL = 'https://api-pr-113-8owu.onrender.com'

const config = defineConfig({
  root: '.',
  input: {
    path: `${baseURL}/documentation/json`,
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
