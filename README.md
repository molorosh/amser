# Introduction 
Time Tracking Software implemented in Angular v21 

# Initial Setup and ng21 local install

open a terminal and navigate to your source folder
```
~>cd source\repos
```
now clone the repo
```
~\source\repos> git clone https://HRicketts@dev.azure.com/HRicketts/Training%20Day/_git/tracker
```
```
~\source\repos> cd tracker
```
check the angular version installed globally
```
~\source\repos\tracker> ng --version 
```
19.1.2, opps! not the version I want 

opps the wrong version

~\source\repos\tracker> npm install @angular/cli@21 --save-dev

also create a .gitignore file that just contains a single line:
```
/node_modules
```
check the local version
```
~\source\repos\tracker> ng --version 
```
21.1.12

yay! now we are ready to go

```
~\source\repos\tracker> ng new amser
```

The settings I chose for new project creation were:
- Which stylesheet format would you like to use? `Sass(SCSS)` 
- Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? `No`

Note: Amser is the welsh word for "time".




