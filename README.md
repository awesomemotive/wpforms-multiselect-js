# WPForms MultiSelect Checkbox

[![Built for WPForms](https://img.shields.io/badge/Built%20for-WPForms-%23e27730)](https://wpforms.com)

The "MultiSelect Checkbox" is a versatile vanilla JavaScript plugin designed to enhance the functionality of select dropdowns. This plugin transforms a regular select dropdown into a dynamic multi-select checkbox dropdown. With this plugin, users can select multiple options from a list by simply checking the corresponding checkboxes, providing a more intuitive and user-friendly interface.

The plugin seamlessly replaces the default select dropdown with a customizable dropdown menu, enriched with checkboxes for each option. Users can select and deselect options with ease, allowing for more flexible and efficient data selection.

This plugin offers various configuration options, such as showing search functionality, displaying selected options as tags, enabling a clear button for easy deselection, and even providing a mask to indicate when all options are selected. Additionally, the plugin supports internationalization, allowing you to customize the language used in the dropdown for better localization.

## Development

To build the distribution versions of the plugin, you'll need to have [Node.js](https://nodejs.org/) installed on your computer. Follow the steps below:

1. Download or fork the repository.
2. Open a terminal or command prompt and navigate to the downloaded repository folder.
3. Run the command `npm ci` to install the dependencies. This will create a `/node_modules/` folder with the necessary packages.
4. Make any desired changes to the plugin files located inside the `/src/` folder. Customize the plugin according to your requirements.
5. Once your changes are complete, run the command `npm run minify` in the terminal. This command will compile the source files, optimizing them for the production environment.

After running the `npm run minify` command, you will find the distribution versions of the plugin ready for use. The compiled files will be available inside the `dist` folder.

## Linting

To ensure code quality and adherence to our linting rules, we have provided two CLI commands: `lint:css` and `lint:js`. These commands will run linters across the codebase, checking for valid syntax and applying the defined rules.

Here's a description of each command:

- `lint:css`: This command runs `stylelint` on all CSS code located in the `src/css` directory. It utilizes the rules defined in the `.stylelintrc.json` configuration file. By running this command, you can ensure that your CSS code follows the specified linting rules and maintains consistent coding practices.

- `lint:js`: This command executes `eslint` on all JavaScript files in the codebase. It uses the rules specified in the `.eslintrc` configuration file. Running `lint:js` allows you to validate your JavaScript code against the defined linting rules, helping to identify and rectify any potential issues or inconsistencies.

By utilizing these linting commands, you can maintain a high level of code quality and consistency throughout the project.

## Browsers

The plugin has been tested and supports the most recent releases of the all major browsers:

| ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_16x16.png)<br/>Edge | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_16x16.png)<br/>Firefox | ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_16x16.png)<br/>Chrome | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_16x16.png)<br/>Safari | ![iOS Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_16x16.png)<br/>iOS Safari | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_16x16.png)<br/>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- |
| ✓| ✓| ✓| ✓| ✓| ✓

Please note that while the plugin is designed to be compatible with the latest versions of these browsers, it's always recommended to thoroughly test the plugin in your target browsers to ensure optimal compatibility and functionality. Additionally, older versions of these browsers may still work, but they are not officially supported and may exhibit inconsistent behavior.
