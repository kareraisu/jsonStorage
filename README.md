# jsonStorage
A simple interface for storing json collections in local storage.
Expects the objects to have an 'id' property.


## Installation
I couldn't use ES6 array methods when I made this, so I relied on the mighty [underscore](http://underscorejs.org/).

Just download the script, place it somewhere in your project structure (/src /js /utils /etc) and load it in your html after underscore.

```html
<script src="your/project/path/underscore.js"></script>
<script src="your/project/path/jsonStorage.js"></script>
```


## Usage

```javascript

var storage = new jsonStorage();
var myStore = storage.newStore('myStore');

var foo = {id: 1, name:'foo'};
var bar = {id: 2, name:'bar'};

myStore.add(foo);
myStore.get(1);
> {id: 1, name:'foo'}

myStore.add(bar);
myStore.getAll();
> [{id: 1, name:'foo'}, {id: 2, name:'bar'}]

bar = {id: 2, name:'BAR'}
myStore.chain()
	.del(1)
	.add({id: 1, name:'FOO'})
	.set(bar)
	.apply();
> [{id: 1, name:'FOO'}, {id: 2, name:'BAR'}]

myStore.clear();
myStore.getAll();
> []

storage.delStore('myStore');

```

Also, you can make it tell you what the hell it's doing with your precious data, like so:

```javascript
var storage = new jsonStorage({log : true});
```


## Comments, ideas, bugs, pull requests
are all welcome!


## License
This code is released under [the MIT license](https://github.com/kareraisu/jsonStorage/blob/master/LICENSE).