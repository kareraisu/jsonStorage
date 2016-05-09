# jsonStorage
A simple interface for storing json collections in local storage.
Expects the objects to have an 'id' property.

## Installation
Just download it, place it somewhere in your project structure (/src /js /utils /etc) and load it from your html or import it in your js.

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