#Platypi Command Line Interface

##Getting Started

###Install
```
npm install -g platypi-cli
```

###Building
```
grunt build
```

###Testing
```
npm test
```

##Usage

###Generating a Project
```
platypi create <type> <name>
```
Types: mobile / web

###Adding a Control
```
platypi add <type> <name>
```
Types: viewcontrol, injectable, repository, service, model, templatecontrol, attributecontrol

###Removing a Control
```
platypi delete <type> <name>
```
Types: viewcontrol, injectable, repository, service, model, templatecontrol, attributecontrol

###List Controls
```
platypi list
```

###Forcing Updates
```
platypi update
```

###Clearing Cache
```
platypi cache-clean
```