'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const uuid = require('uuid-v4');
const pascalCase = require('pascal-case');
const sln = require('dotnet-solution');

module.exports = class extends Generator {
  prompting() {
    const prompts = [
      {
        when: !this.options.spaType,
        type: 'list',
        name: 'spaType',
        message: 'What language do you want your SPA Module to use?',
        choices: [
          { name: 'ReactJS', value: 'ReactJS' },
          {
            name: chalk.gray('Angular'),
            value: 'angular',
            disabled: chalk.gray('Coming Soon')
          },
          {
            name: chalk.gray('VueJS'),
            value: 'VueJS',
            disabled: chalk.gray('Coming Soon')
          }
        ]
      },
      {
        when: !this.options.company,
        type: 'input',
        name: 'company',
        message: 'Namespace for your module (Usually a company name)?',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.name,
        type: 'input',
        name: 'name',
        message: 'What is the name of your SPA Module?',
        default: this.appname,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.description,
        type: 'input',
        name: 'description',
        message: 'Describe your module:',
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.companyUrl,
        type: 'input',
        name: 'companyUrl',
        message: 'Company Website:',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.emailAddy,
        type: 'input',
        name: 'emailAddy',
        message: 'Your e-mail address:',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      props.projectGuid = uuid();
      props.solutionGuid = uuid();
      props.namespace = pascalCase(props.company);
      props.moduleName = pascalCase(props.name);

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating SPA Module.'));

    let namespace = this.props.company;
    let moduleName = this.props.moduleName;
    let currentDate = this.props.currentDate;
    let projectGuid = this.props.projectGuid;

    this.fs.copy(
      this.templatePath(this.props.spaType + '/App_LocalResources/**'),
      this.destinationPath(moduleName + '/App_LocalResources/')
    );

    this.fs.copy(
      this.templatePath(this.props.spaType + '/_BuildScripts/**'),
      this.destinationPath(moduleName + '/_BuildScripts/')
    );
    this.fs.copy(
      this.templatePath(this.props.spaType + '/Components/**'),
      this.destinationPath(moduleName + '/Components/')
    );
    this.fs.copy(
      this.templatePath(this.props.spaType + '/Controllers/**'),
      this.destinationPath(moduleName + '/Controllers/')
    );
    this.fs.copy(
      this.templatePath(this.props.spaType + '/Providers/**'),
      this.destinationPath(moduleName + '/Providers/')
    );
    this.fs.copy(
      this.templatePath(this.props.spaType + '/Resources/**'),
      this.destinationPath(moduleName + '/Resources/')
    );
    this.fs.copy(
      this.templatePath(this.props.spaType + '/tsconfig.json'),
      this.destinationPath(moduleName + '/tsconfig.json')
    );
    this.fs.copy(
      this.templatePath(this.props.spaType + '/Properties/**'),
      this.destinationPath(moduleName + '/Properties/')
    );

    this.fs.copyTpl(
      this.templatePath('../../gulp/*.js'),
      this.destinationPath(moduleName + '/_BuildScripts/gulp/'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/Components/FeatureController.cs'),
      this.destinationPath(moduleName + '/Components/FeatureController.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/Controllers/DataController.cs'),
      this.destinationPath(moduleName + '/Controllers/DataController.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/src/**'),
      this.destinationPath(moduleName + '/src/'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/RouteConfig.cs'),
      this.destinationPath(moduleName + '/RouteConfig.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/Edit.html'),
      this.destinationPath(moduleName + '/Edit.html'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/Settings.html'),
      this.destinationPath(moduleName + '/Settings.html'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/View.html'),
      this.destinationPath(moduleName + '/View.html'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/manifest.dnn'),
      this.destinationPath(moduleName + '/' + moduleName + '.dnn'),
      {
        namespace: namespace,
        moduleName: moduleName,
        moduleFriendlyName: this.props.name,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/Properties/AssemblyInfo.cs'),
      this.destinationPath(moduleName + '/Properties/AssemblyInfo.cs'),
      {
        namespace: namespace,
        moduleName: moduleName,
        currentYear: currentDate.getFullYear()
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/_Project.csproj'),
      this.destinationPath(moduleName + '/' + moduleName + '.csproj'),
      {
        namespace: namespace,
        moduleName: moduleName,
        projectGuid: projectGuid
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/package.json'),
      this.destinationPath(moduleName + '/package.json'),
      {
        namespace: namespace,
        moduleName: moduleName,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy
      }
    );

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/gulpfile.js'),
      this.destinationPath(moduleName + '/gulpfile.js'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copy(
      this.templatePath(this.props.spaType + '/.babelrc'),
      this.destinationPath(moduleName + '/.babelrc')
    );

    this.fs.copy(
      this.templatePath(this.props.spaType + '/packages.config'),
      this.destinationPath(moduleName + '/packages.config')
    );

    this.fs.copy(
      this.templatePath(this.props.spaType + '/License.md'),
      this.destinationPath(moduleName + '/License.md')
    );

    this.fs.copy(
      this.templatePath(this.props.spaType + '/ReleaseNotes.md'),
      this.destinationPath(moduleName + '/ReleaseNotes.md')
    );

    this.fs.copy(
      this.templatePath(this.props.spaType + '/web.config'),
      this.destinationPath(moduleName + '/web.config')
    );

    this.fs.copy(
      this.templatePath(this.props.spaType + '/web.Debug.config'),
      this.destinationPath(moduleName + '/web.Debug.config')
    );

    this.fs.copy(
      this.templatePath(this.props.spaType + '/web.Release.config'),
      this.destinationPath(moduleName + '/web.Release.config')
    );

    this._writeSolution();
  }

  _createSolutionFromTemplate() {
    this.log(chalk.white('Creating sln from template.'));
    let namespace = this.props.company;
    let moduleName = this.props.moduleName;
    let projectGuid = this.props.projectGuid;
    let solutionGuid = this.props.solutionGuid;

    this.fs.copyTpl(
      this.templatePath(this.props.spaType + '/_Template.sln'),
      this.destinationPath(namespace + '.sln'),
      {
        moduleName: moduleName,
        projectGuid: projectGuid,
        solutionGuid: solutionGuid
      }
    );
  }

  _addProjectToSolution() {
    this.log(chalk.white('Adding project to existing sln.'));
    let namespace = this.props.company;
    let moduleName = this.props.moduleName;
    let projectGuid = this.props.projectGuid;
    let slnFileName = this.destinationPath(namespace + '.sln');

    // Create a reader, and build a solution from the lines
    const reader = new sln.SolutionReader();
    const sourceLines = this.fs
      .read(slnFileName)
      .toString()
      .split(/\r?\n/);
    const solution = reader.fromLines(sourceLines);

    solution.addProject({
      id: projectGuid, // This is the same id as in the csproj
      name: moduleName,
      path: moduleName + '\\' + moduleName + '.csproj', // Relative to the solution location
      parent: moduleName // The name or id of a folder to parent it to
    });

    // Create a writer and write back to the same file
    const writer = new sln.SolutionWriter();
    const lines = writer.write(solution);
    this.fs.write(slnFileName, lines.join('\r\n'));
  }

  _writeSolution() {
    let namespace = this.props.company;
    let slnFileName = this.destinationPath(namespace + '.sln');
    if (this.fs.exists(slnFileName)) {
      this.log(chalk.white('Existing sln file found.'));
      this._addProjectToSolution();
    } else {
      // File does not exist
      this.log(chalk.white('No sln file found.'));
      this._createSolutionFromTemplate();
    }
  }

  install() {
    if (!this.options.noinstall) {
      process.chdir(this.props.moduleName);
      this.installDependencies({ npm: true, bower: false, yarn: false }).then(() => {
        this.log(chalk.white('Installed SPA Module npm Dependencies.'));
        this.log(chalk.white('Running NuGet.'));
        this.spawnCommand('gulp', ['nuget']);
        process.chdir('../');
      });
    }
  }

  end() {
    this.log(chalk.white('All Ready!'));
  }
};
