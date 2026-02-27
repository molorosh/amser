# Dev Notes
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

yay! now we are ready to go.  We're using npx instead of npm so that we use the local version of Angular.

```
~\source\repos\tracker> npx ng new amser
```

The settings I chose for new project creation were:
- Which stylesheet format would you like to use? `Sass(SCSS)` 
- Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? `No`
- Which AI tools do you want to use?: `GitHub Copilot`

Note: Amser is the welsh word for "time".

## Transfering Repos
I original had this project hosted in DevOps and used the following steps to migrate it to GitHub.  Both repositories were Git obviously.

I created this repo in GitHub (with the same name as the DevOps one) but created it empty (without an License, README.md or .gitignore file)

On the machine that was setup for the DevOps environment I issued the command:
```
git clone --mirror https://dev.azure.com/ORG/PROJECT/_git/REPO_NAME
```

then I zipped the repo.git folder and set it to my machine that is setup for github.

then i downloaded and unzipped the .zip file and then navigated inside the resulting repo.git folder

then inside the repo.git directory I typed
```
git remote set-url origin https://github.com/molorosh/amser.git
```
and then 
```
git push --mirror
```
and then the repo with commit history appeared here properly! 😍

