"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the tiptop ${chalk.red("generator-compendium")} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message:
          "Enter a module name, lower case only, with dashes as separators:",
        validate: function(input) {
          // Declare function as asynchronous, and save the done callback
          var done = this.async();

          // Do async stuff
          setTimeout(function() {
            if (input.match(/[^a-z0-5-]/) !== null) {
              // Pass the return value in the done callback
              done("Only lower case characters and dashes are allowed");
              return;
            }

            // Pass the return value in the done callback
            done(null, true);
          }, 500);
        }
      },
      {
        type: "input",
        name: "title",
        message: "Enter the title of your compendium:"
      },
      {
        type: "input",
        name: "abbreviation",
        message: "Enter an abbreviation for your compendium:"
      },
      {
        type: "input",
        name: "description",
        message: "Enter a description of your compendium:"
      },
      {
        type: "input",
        name: "author",
        message: "Enter author name of your compendium:"
      },
      {
        type: "input",
        name: "url",
        message: "Enter project URL:",
        validate: function(string) {
          var done = this.async();

          // Do async stuff
          setTimeout(function() {
            let url;

            try {
              url = new URL(string);
            } catch (_) {
              done("Must be a valid URL.");
              return;
            }

            if (url.protocol === "http:" || url.protocol === "https:") {
              done(null, true);
            } else {
              done('Protocol must be "http" or "https"');
            }
          }, 500);
        }
      },
      {
        type: "checkbox",
        name: "actorTypes",
        message: "Which Actor compendiums should be created?",
        choices: [
          {
            value: "Player Characters",
            name: "Player Characters",
            checked: false
          },
          {
            value: "NPCs",
            name: "NPCs",
            checked: false
          },
          {
            value: "Monsters",
            name: "Monsters",
            checked: true
          }
        ]
      },
      {
        type: "checkbox",
        name: "itemTypes",
        message: "Which Item compendiums should be created?",
        choices: [
          {
            value: "Feats",
            name: "Feats",
            checked: false
          },
          {
            value: "Classes",
            name: "Classes",
            checked: true
          },
          {
            value: "Class Features",
            name: "Class Features",
            checked: true
          },
          {
            value: "Races",
            name: "Races",
            checked: true
          },
          {
            value: "Racial Features",
            name: "Racial Features",
            checked: true
          },
          {
            value: "Equipment",
            name: "Equipment",
            checked: true
          },
          {
            value: "Spells",
            name: "Spells",
            checked: true
          }
        ]
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      console.log(props);
    });
  }

  writing() {
    let moduleJSON = {
      version: "1.0.0",
      minimumCoreVersion: "9",
      compatibleCoreVersion: "9",
      name: this.props.name,
      title: this.props.title,
      description: this.props.description,
      author: this.props.author,
      url: this.props.url,
      packs: []
    };

    this.props.actorTypes.forEach(element => {
      const name = element.toLowerCase().replace(" ", "");
      moduleJSON.packs.push({
        name: name,
        label: `${element} (${this.props.abbreviation})`,
        path: `./packs/${name}.db`,
        module: this.props.name,
        entity: "Actor"
      });
    });
    this.props.itemTypes.forEach(element => {
      const name = element.toLowerCase().replace(" ", "");
      moduleJSON.packs.push({
        name: name,
        label: `${element} (${this.props.abbreviation})`,
        path: `./packs/${name}.db`,
        module: this.props.name,
        entity: "Item"
      });
    });
    this.moduleJSON = moduleJSON;
  }

  install() {
    fs.mkdirSync(this.props.name);
    fs.mkdirSync(`${this.props.name}/packs`);
    this.moduleJSON.packs.forEach(pack => {
      fs.writeFileSync(`${this.props.name}/${pack.path}`, "");
    });
    fs.writeFileSync(
      `${this.props.name}/module.json`,
      JSON.stringify(this.moduleJSON, undefined, 2)
    );
    console.log(this.moduleJSON);
  }
};
