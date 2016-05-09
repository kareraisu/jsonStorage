var jsonStorage = function(settings) {

  var ls = window.localStorage;

  var _logging = settings ? settings.log : false;

  this._stores = [];

  this.newStore = function(storeName) {
    if (ls.getItem(storeName)) {
      if (_logging) console.info('Using already existing store "'+ storeName +'" and its contents.');
    }
    else {
      ls.setItem(storeName, JSON.stringify([]));
      if (_logging) console.info('Created new store "'+ storeName +'"');
    }
    this._stores.push(storeName);
    return this.getStore(storeName);
  }

  this.getStore = function(storeName) {
    var _store = {};

    var _storeItems = JSON.parse(ls.getItem(storeName));

    var _setItems = function(items) {
      if (!items) items = _storeItems;
      ls.setItem(storeName, JSON.stringify(items));
    }

    var _chaining = false;

    var _fyi = 'Store "'+ storeName +'": ';

    if (_.contains(this._stores, storeName)) {
      store = {

        get : function(id) {
          var item = _.find(_storeItems, function(itm) {return itm.id == id});
          if (!item) {
            if (_logging) console.info(_fyi +'cannot get item '+ id +' - not found');
          }
          return item;
        },

        add : function(item) {
          var done = false;
          if (!item.id) {
            console.error(_fyi +'cannot add item - no id');
            if (_chaining) return this;
          }
          else {
            var exists = _.find(_storeItems, function(itm) {return itm.id == item.id});
            if (exists) {
              if (_logging) console.info(_fyi +'cannot add item '+ item.id +' - already there');
              if (_chaining) return this;
            }
            else {
              _storeItems.push(item);
              if (_logging) console.info(_fyi +'added item '+ item.id);
              if (_chaining) return this;
              _setItems();
              done = true;
            }
          }
          return done;
        },

        del : function(id) {
          if (id && typeof id == 'object') id = id.id;
          var done = false;
          var i = _.findIndex(_storeItems, function(item) {return item.id == id});
          if (i == -1) {
            if (_logging) console.info(_fyi +'cannot delete item '+ id +' - not found');
            if (_chaining) return this;
          }
          else {
            _storeItems.splice(i, 1);
            if (_logging) console.info(_fyi +'deleted item '+ id);
            if (_chaining) return this;
            _setItems();
            done = true;
          }
          return done;
        },

        set : function(item) {
          var done = false;
          if (!item.id) {
            console.error(_fyi +'cannot udpate item - no id');
            if (_chaining) return this;
          }
          else {
            var i = _.findIndex(_storeItems, function(itm) {return itm.id == item.id});
            if (i == -1) {
              if (_logging) console.info(_fyi +'cannot udpate item '+ item.id +' - not found');
              if (_chaining) return this;
            }
            else {
              _storeItems.splice(i, 1, item);
              if (_logging) console.info(_fyi +'updated item '+ item.id);
              if (_chaining) return this;
              _setItems();
              done = true;
            }
          }
          return done;
        },

        getAll : function() {
          if (_chaining) {
            console.log('FYI: there is no need for getAll() while _chaining, apply() has it covered!');
            return this;
          }
          return _storeItems;
        },

        setAll : function(items) {
          _storeItems = items;
          _setItems();
          if (_chaining) {
            return this;
          }
        },

        addAll : function(newItems) {
          var updatedItems = [], sitem, i, u=0, n=0;
          // filter out the store items which are (potentially) outdated
          for (var j in _storeItems) {
            sitem = _storeItems[j];
            i = _.findIndex(newItems, function(nitem) { return nitem.id == sitem.id; });
            if (i == -1) updatedItems.push(sitem);
          }
          if (_logging) {
            u = _storeItems.length - updatedItems.length;
            n = newItems.length - u;
            console.info(_fyi +'added '+ n +' new & updated '+ u +' existing items');
          }
          // then add all the new items
          _storeItems = _.union(updatedItems, newItems);
          if (_chaining) return this;
          _setItems();
        },

        delAll : function(ids) {
          var d=0, id, i;
          for (var j in ids) {
            id = ids[j];
            if (typeof id == 'object') id = id.id;
            i = _.findIndex(_storeItems, function(item) {return item.id == id});
            if (i != -1) {
              _storeItems.splice(i, 1);
              d++;
            }
          }
          if (_logging) console.info(_fyi+ 'deleted '+ d +' items');
          if (_chaining) return this;
          _setItems();
        },

        clear : function() {
          _storeItems = [];
          _setItems();
          if (_logging) console.info(_fyi+ 'cleared');
          if (_chaining) return this;
        },

        chain : function() {
          _chaining = true;
          return this;
        },

        apply : function() {
          _chaining = false;
          _setItems();
          return _storeItems;
        },

      };
    }
    else {
      if (_logging) console.info('Store "'+ storeName +'" not found.');
    }

    return store;
  }

  this.delStore = function(storeName) {
    var done = false;
    var i = _.indexOf(this._stores, storeName);
    if (i == -1) {
      if (_logging) console.info('Store "'+ storeName +'" not found.');
    }
    else {
      ls.remove(storeName);
      this._stores.splice(i, 1);
      done = true;
      if (_logging) console.info('Store "'+ storeName +'" deleted.');
    }
    return done;
  }

  this.clearAll = function() {
    for (var i in this._stores) {
      this.getStore(this._stores[i]).clear();
    }
  }


}
