'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('DNN') + ' project generator!'
    ));
    this.log(
      chalk.white('This scaffolds the project in your current directory.')
    );

    const prompts = [{
      when: !this.options.projType,
      type: 'list',
      name: 'projType',
      message: 'What type of project would you like to scaffold?',
      choices: [
        {name: 'MVC Module', value: 'mvc'},
        {name: 'SPA Module', value: 'spa'},
        {name: 'Webforms Module', value: 'webforms'},
        {name: 'Theme', value: 'theme'}
      ]
    },
    {
      when: !this.options.name,
      type: 'input',
      name: 'name',
      message: 'What is the name of your project?'
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  composing() {
    const options = {
      projType: this.props.sample,
      name: this.props.name
    };

    this.composeWith(require.resolve(`../${this.props.projType}`), options);
    this.composeWith(require.resolve('generator-fountain-gulp/generators/app'), options);
  }

  writing() {

      this.fs.copy(
        this.templatePath('dummyfile.txt'),
        this.destinationPath('dummyfile.txt')
      );
  }

  install() {
    //this.installDependencies({ npm: true, bower: false, yarn: false });
  }
};
