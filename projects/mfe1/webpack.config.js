const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  name: "mfe1",

  exposes: {
    "./ContactsModule":
      "./projects/mfe1/src/app/contact-list/contact-list.routes.ts",
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },
});
// Optionally, log after configuration is exported
console.log("Configuring Module Federation for mfe1");
