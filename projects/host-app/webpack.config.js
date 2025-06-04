const path = require("path");
const {
  shareAll,
  SharedMappings,
} = require("@angular-architects/module-federation/webpack");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const sharedMappings = new SharedMappings();
sharedMappings.register(path.resolve(__dirname, "tsconfig.app.json"));

module.exports = {
  output: {
    uniqueName: "hostApp",
    publicPath: "auto",
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        mfe1: "mfe1@http://localhost:4201/remoteEntry.js",
        mfe2: "mfe2@http://localhost:4202/remoteEntry.js",
        loginMfeApp: "loginMfeApp@http://localhost:4203/remoteEntry.js",
      },
      shared: {
        ...shareAll({
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        }),
      },
    }),
    sharedMappings.getPlugin(),
  ],
};
