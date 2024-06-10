const mustache = require("mustache");
const { join } = require("path");
const { readFileSync } = require("fs"); //Filesystem

module.exports = (templateName, data) => {
  const templatePath = join(__dirname, `../templates/${templateName}`);
  const content = readFileSync(templatePath, "utf-8");

  const output = mustache.render(content, data);

  return output;
};
