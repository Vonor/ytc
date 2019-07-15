# ytc - Yaml Template Converter

[![dependencies Status](https://david-dm.org/vonor/ytc/status.svg)](https://david-dm.org/vonor/ytc)
[![devDependencies Status](https://david-dm.org/vonor/ytc/dev-status.svg)](https://david-dm.org/vonor/ytc?type=dev)

With `ytc` it is possible to validate a yaml file against a schema and render it as whatever configuration file you need.
The need for this tool arose when we decided to introduce DevOps practices and Config Management. Since a lot of tools for DevOps practices use `yaml` for their configurations I thought it practical to have all our config files in `yaml` for easier maintainability.

## Install

Compatible with `Node 10`.

```shell
git clone https://github.com/Vonor/ytc
cd ytc
npm install
npm run pkg
```

The ready binary will be in the `pkg` directory.

## Usage

```shell
ytc [command] [file]
```

Whereas `command` can be either `convert` (or `c` for short) or `validate` (or `v` for short)

It is expected that your have the following directory structure

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

The `configs` folder will hold all the `yaml` configuration files. It can have subdirectories. The `schemas` folder will store all the schema files and the `templates` folder stores all templates. Both directories should be flat.

### Yaml files

Each `yaml` file needs to have the following structure:

```yaml
Schema: schema
outputextension: .ext
```

Whereas `Schema` represents the name of the schema-file and `outputextension` represents the file extension for the output; Default: `.conf`

For example:

```yaml
Schema: apache_vhost
outputextension: .conf
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
outputextension:
  type: string
  required: true
  match: ^\..+$
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

Access to the environment variables can be done via

```shell
export SOMEVAR="foobar"
ytc convert file
```

```hbs
{{env.SOMEVAR}}
```

You could also have an environment variable that contains `json` Data.

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
toLowerCase(str) // return str.toLowerCase()
toUpperCase(str) // return str.toUpperCase()
parse(str) // return JSON.parse(str);
stringify(str) // return JSON.stringify(str, null, 2);
assignjson(varname, value) // parses JSON 'value' and assigns it to 'varname'
is(a, b) // Compare a with b
isnot(a, b) // Compare whether a is not equal to b
length(a) // if a is object, return length, otherwise '#'
```

If you need more helper functions please file a [Github Issue](https://github.com/Vonor/ytc/issues)
