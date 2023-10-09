# BoilerPlate For Apps that run on AWS ECS
Github template repositories is a convenient way that allows us to create a new repository with the same directory structure and files as they are in the template repository. 
This repository servers as a template repository(a.k.a boilerplate) for all apps that will run on AWS ECS Infrastructure since it has it's own specific github actions pipeline as well.

When you create repository using this template, it will also contain the **.gitignore files for multiple languages/framework. You can then pick and choose the .gitignore file that is related to your language/framework in use and remove the others. So essentially for a node app, you will remove all the .gitignore files except for Node.gitignore and then rename it to .gitignore.
