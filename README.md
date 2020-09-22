# sls-base
Base for create a project in serverless framework

## What's included

-   Folder structure used consistently across our projects.
-   [serverless-pseudo-parameters plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Allows you to take advantage of CloudFormation Pseudo Parameters.
-   [serverless-plugin-optimize](https://www.npmjs.com/package/serverless-plugin-optimize): Bundle with Browserify, transpile and minify with Babel automatically to your NodeJS runtime compatible JavaScript.

## Getting started

```
sls create --name YOUR_PROJECT_NAME --template-url https://github.com/ivanojgarcia/sls-base
cd YOUR_PROJECT_NAME
npm install
```
