const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  name: "mfe2",

  exposes: {
    "./Component": "./projects/mfe2/src/app/app.component.ts",
    "./Module": "./projects/mfe2/src/app/mfe2/mfe2.module.ts",
    "./AdminModule": "./projects/mfe2/src/app/contact-admin/admin.module.ts",
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },
});
