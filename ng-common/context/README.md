## Context module

### Context is an object with references to interfaces and data.

There is a tree of contexts:
  Root -- Domain1 -- Application1 -- Request1024
       -- Domain1 -- Application2 -- Request2049
       -- Domain2 -- Application1 -- RequestXXXX

1. Some nodes (contexts) contains references to interfaces
    There are single ones per server/application/domain.
    Such contexts are used as DI/IoC containers.
    E.g., Root, Domain, Application.
2. Another ones contains only some specific data
    and inherit all functions from their parents.
    Such ones created all the time.
    E.g., Request, Message.

### DI/IoC

```
const common = require('ng-common');
const context = common.context.create();
```

### Domain

Domain is an abstraction of the real-world business domain.
It uses to restrict/authorize access to specific data/resource.
The service/method may be domain aware.
The context contains the `domain` label.

```
context.domain
```

- domain1
- domain1.app1
- domain1.app2

There is the tree of the domains and the tree of the contexts.

Usually, the project has its own business domain.
There would be sub-domains for applications/roles specified for the project.

- single root context and root domain
- root + single project domain and context for application
- root + several projects domains

In the business-specific route handlers we create request context from the `domain1` or `domain1.app1` context.
So, the domain label are already built-in/hardcoded in the context.
The services specific for the business project are called from those route handlers only.

What about common features:
- file
- blockchain

Those route handlers uses general root context.
They should read/get actual domain from the request data,
then, the context should be retrieved from domain-context map/dict.


TODO: write some more description, examples, etc.