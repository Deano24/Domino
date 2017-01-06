# Deano24 Domino

A simple remake of the historical domino game.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The following is required to work with the program:

* Node & NPM
* Grunt
* Bower
* Compass

#### Node & NPM

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs
apt-get install -y build-essential
```

#### Grunt

```
npm -g install grunt
npm install -g grunt-cli
```

#### Bower

```
npm install -g bower
```

#### Compass (Assumes Ruby)

```
gem install compass
```

### Installing

A step by step series of examples that tell you have to get a development env running

Get a copy of the repo

```
git clone https://deano24@bitbucket.org/deano24/domino.git Domino
```

Navigate to project directory

```
cd Domino
```

Install node modules

```
npm install
```

Install bower libraries

```
bower install
```

Running the program

```
grunt serve
```

### Deploying

A step by step guide to creating a deployment ready version.

Build the application

```
grunt build
```

And you are done, the files will be found inside the dist folder.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://bitbucket.org/deano24/domino/tags). 

## Authors

* **Rohan Malcolm** - *Initial Application Development* - [Deano24](https://github.com/Deano24)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
