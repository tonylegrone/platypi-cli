# Platypi Command Line Interface

## Getting Started

### Install
```
npm install platypi-cli -g
```

### Building
```
grunt build
```

### Testing
```
npm test
```
A test coverage report is generated in the coverage/ directory.

## Usage

### Generating a Project
```
platypi create <name>
```

### Adding a component
```
platypi add <type> <name>
```
Types: viewcontrol, injectable, repository, service, factory, templatecontrol, attributecontrol

#### Extending a component
You may extend a component with an existing component using the '--extends <name>' flag. '-e' for short.
```
platypi add <type> <name> --extends <name>
platypi add <type> <name> -e <name>
```

### List Components
```
platypi list
```
This command will list all platypi components currently configured to a project.

### Forcing Updates
```
platypi update
```
This command downloads the template files associated with the template version number in the package.json file to the OS specific AppData directory.

### Clearing Cache
```
platypi cache-clean
```
This command forces the CLI to clear the files stored in the OS specific AppData directory.

### Project Template Version
```
platypi template
```
Prints the template version number used to generate the project in the current working directory.
