#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const yargs = require('yargs');
const ejs = require('ejs');

const CURR_DIR = process.cwd();

function render(content, data) {
    return ejs.render(content, data);
}

function showMessage(options) {
    console.log('');
    console.log(chalk.green('Done.'));
    console.log(chalk.green(`Run building: npm start`));
    const message = options.config.postMessage;
    if (message) {
        console.log('');
        console.log(chalk.yellow(message));
        console.log('');
    }
}

function getTemplateConfig(templatePath) {
    const configPath = path.join(templatePath, '.template.json');
    if (!fs.existsSync(configPath))
        return {};
    const templateConfigContent = fs.readFileSync(configPath);
    if (templateConfigContent) {
        return JSON.parse(templateConfigContent.toString());
    }
    return {};
}

function createProject(projectPath) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);
    return true;
}

function postProcess(options) {
    if (isNode(options)) {
        return postProcessNode(options);
    }
    return true;
}

function isNode(options) {
    return fs.existsSync(path.join(options.templatePath, 'package.json'));
}

function postProcessNode(options) {
    shell.cd(path.join(CURR_DIR, options.projectName));
    let cmd = '';
    if (shell.which('npm')) {
        cmd = 'npm install';
    }
    if (cmd) {
        const result = shell.exec(cmd);
        if (result.code !== 0) {
            return false;
        }
    } else {
        console.log(chalk.red('No npm found. Cannot run installation.'));
    }
    return true;
}
const SKIP_FILES = ['node_modules', '.template.json'];
const JUST_COPY = ['.png'];

function createDirectoryContents(templatePath, projectName, config, answers) {
    const filesToCreate = fs.readdirSync(templatePath);
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);
        // get stats about the current file
        const stats = fs.statSync(origFilePath);
        if (SKIP_FILES.indexOf(file) > -1)
            return;
        if (stats.isFile()) {
            const writePath = path.join(CURR_DIR, projectName, file);
            if (JUST_COPY.map(e => file.indexOf(e) > -1).reduce((acc, cur) => acc || cur)) {
                fs.copyFileSync(origFilePath, writePath);
                return;
            }
            let contents = fs.readFileSync(origFilePath, 'utf8');
            contents = render(contents, {
                projectName,
                ...answers
            });
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            // recursive call
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), config, answers);
        }
    });
}

function start() {
    const QUESTIONS = [{
            name: 'template',
            type: 'list',
            message: 'What project template would you like to generate?',
            choices: [
                { name: 'Feature (TypeScript based project)', value: 'feature-ts' }, 
                { name: 'Adapter (TypeScript based project)', value: 'adapter-ts' }
            ],
            when: () => !yargs.argv['template']
        },
        {
            name: 'name',
            type: 'input',
            message: 'Project name (ENS address, e.g: feature_name.dapplet-base.eth):',
            when: () => !yargs.argv['name'],
            validate: (input) => {
                if (/^([A-Za-z\-\_\d\.])+$/.test(input))
                    return true;
                else
                    return 'Project name may only include letters, numbers, underscores, hashes and dots.';
            }
        },
        {
            name: 'title',
            type: 'input',
            message: 'Project title:',
            when: () => !yargs.argv['title'],
            default: ''
        },
        {
            name: 'description',
            type: 'input',
            message: 'Project description:',
            when: () => !yargs.argv['description'],
            default: ''
        },
        {
            name: 'author',
            type: 'input',
            message: 'Project author:',
            when: () => !yargs.argv['author'],
            default: ''
        },
        {
            name: 'hostname',
            type: 'input',
            message: 'In which hostname do you want to use the feature?',
            when: (answers) => !yargs.argv['hostname'] && answers['template'] === 'feature-ts',
            default: 'twitter.com'
        }
    ];
    inquirer.prompt(QUESTIONS)
        .then(answers => {
            answers = Object.assign({}, answers, yargs.argv);
            const projectChoice = answers['template'];
            const projectName = answers['name'];
            const templatePath = path.join(__dirname, '../templates', projectChoice);
            const tartgetPath = path.join(CURR_DIR, projectName);
            const templateConfig = getTemplateConfig(templatePath);
            const options = {
                projectName,
                templateName: projectChoice,
                templatePath,
                tartgetPath,
                config: templateConfig
            };
            if (!createProject(tartgetPath)) {
                return;
            }
            createDirectoryContents(templatePath, projectName, templateConfig, answers);
            if (!postProcess(options)) {
                return;
            }
            showMessage(options);
        });
}

module.exports.start = start;