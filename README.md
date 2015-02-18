#Platypi Command Line Interface

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

## Usage

### Generating a Project
```
platypi create <name>
```

### Adding a component
```
platypi add <type> <name>
```
Types: viewcontrol, injectable, repository, service, model, templatecontrol, attributecontrol

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

### Forcing Updates
```
platypi update
```

### Clearing Cache
```
platypi cache-clean
```