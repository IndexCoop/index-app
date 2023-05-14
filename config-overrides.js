// Added as per these suggestion to fix an import error when using the ledger wagmi connector:
// https://stackoverflow.com/questions/68316320/module-not-found-did-you-mean-js
module.exports = function override(config, env) {
    // New config, e.g. config.plugins.push...

    config.module.rules = [...config.module.rules, 
        {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false
            }
        }
      ]

    return config
}
