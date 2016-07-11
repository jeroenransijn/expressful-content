# Expressful content
> Give JSON and CSON superpowers for content management

```
$ npm install expressful-content --save
```

## Quick start

Expressful content makes it easy to use a flat file based content system.
You can use this to move your content out of your views.
This makes it easy to plugin a flat file CMS.

```javascript
// app.js
const parseFile = require('expressful-content').parseFile;
const path = require('path');

const CONTENT_DIRECTORY = path.join(__dirname, '/content/');

parseFile(CONTENT_DIRECTORY, 'homepage.cson');

```

### Returns:

```javascript
{
  title: 'Homepage',
  brandName: 'Expressful content',
  posts: [{ title: 'My first article'}, { title: 'My second article' }]
}
```

### Given the following structure:

```
.
|-- /app.js
|-- /content
|   |-- /homepage.cson
|   |-- /global.json
|   |-- /blog
|       |-- 2016__07__10__first-article.cson
|       |-- 2016__07__11__second-article.cson
```

**./content/homepage.cson**
```cson
title: "Homepage"

__extend: "global.cson",

__list:
  directory: 'blog',
  as: 'posts'
```

**global.json**
```json
{
  "brandName": "Expressful content"
}
```

**2016__07__10__first-article.cson**
```cson
title: "My first article"
```

**2016__07__11__second-article.cson.cson**
```cson
title: "My second article"
```
