# ytc - Yaml Template Converter

With `ytc` it is possible to validate a yaml file against a schema and render it as whatever configuration file you need.
The need for this tool arose when we decided to introduce DevOps practices and Config Management. Since a lot of tools for DevOps practices use `yaml` for their configurations I thought it practical to have all our config files in `yaml` for easier maintainability.

## Install

Written and tested with `Node v12.2.0`. Other versions were not tested by me and thus are considered incompatible.

```shell
$ sudo npm i -g vonor/ytc
```

## Usage

```shell
$ ytc [command] [file]
```

It is expected that your have the following Directory structure

```shell
$ tree
.
├── configs
│   └── subdir
│       └── anothersubdir
│           └── myconfig.yaml
├── schemas
│   └── <schema>.schema.yml
└── templates
    └── <schema>.template.hbs

```

The `configs` folder will hold all the yaml configuration files. It can have subdirectories. The `schemas` folder will store all the schema files and the `templates` folder stores all templates.

### Yaml files

The only requirement from the app is, that every `yaml` file contains an entry `Schema`.

For example:

```yaml
Schema: apache_vhost
VirtualHost:
  IP: 127.0.0.1
  http_port: 80
  serveralias: myserver.example.com
```

### Schema files

In the `schemas` directory `ytc` expects a file with the name `<schema>.schema.yml`. So if in the config-yaml you specified `Schema: apache_vhost` the schema file is expected to be named `apache_vhost.schema.yml`

For Schema validation I am using [isvalid](https://github.com/trenskow/isvalid). Please check their documentation.

Below is an example for validation of the above mentioned `yaml` file.
As types you can specify everything implemented in [vonor/mapTypes](https://github.com/vonor/maptypes)

Schemas with the `match` tag are converted to type `RegExp`

```yaml
Schema:
  type: string
  required: true
  equal: apache_vhost
VirtualHost:
  type: object
  required: true
  schema:
    IP:
      type: string
      required: true
      match: ^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
    http_port:
      required: true
      type: number
    servername:
      type: string
      required: true
```

### Template files

As rendering engine [Handlebars](https://handlebarsjs.com/) is used. Please check their documentation for details on templating. Below are two quick examples based on the above mentioned `yaml` file.

Output as Apache VirtualHost configuration file
```hbs
Listen {{VirtualHost.IP}}:{{VirtualHost.http_port}}

<VirtualHost {{VirtualHost.IP}}:{{VirtualHost.http_port}}>

    ServerName {{VirtualHost.servername}}
</VirtualHost>
```

Output as JSON.

```hbs
{{{stringify @root}}}
```

Please be aware that the Environment is added to the Root Object as well and would be included in the output of above statement.

Access to the environtmen variables can be done via

```shell
export SOMEVAR="foobar"
ytc convert file
```

```hbs
{{env.SOMEVAR}}
```

You could also have an environemnt variable that contains `json` Data.

```shell
export SOMEVAR='{"date":"'$(date)'","author":"'${USERNAME}'"}'
# {"date":"Di 21. Mai 22:19:51 CEST 2019","author":"Vonor"}
ytc convert file
```

```hbs
{{#if env.SOMEVAR}} {{{ assignjson "somevar" env.SOMEVAR}}} {{/if}}
Author: {{somevar.author}}
Date: {{somevar.date}}
```

The following `Handlebars` `HelperFunctions` are defined. They can be called via `{{{toUpperCase "string"}}}`. For example `{{{toUpperCase VirtualHost.servername}}}`. Please notice the tripple brackets to ensure strings are not safeloaded for HTML!

```javascript
    'toLowerCase': function(str) {
        return str.toLowerCase();
    },
    'toUpperCase': function(str) {
        return str.toUpperCase();
    },
    'parse': function(str) {
        return JSON.parse(str);
    },
    'stringify': function(str) {
        return JSON.stringify(str, null, 2);
    },
    'assignjson': function(varname, value, options) {
        options.data.root[varname] = JSON.parse(value);
    }
```

If you need more helper functions please send a Pull Request