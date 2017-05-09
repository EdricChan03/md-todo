angular.module('MdTodoApp').service('todoStorage', function ($q) {
    var _this = this;
    this.data = [];
    /**
     * Finds from all of the storage data
     * @param {any} callback
     * @todo Find out what this does
     * @version 1.0.1
     */
    this.findAll = function(callback) {
        chrome.storage.sync.get('todo', function(keys) {
            if (keys.todo != null) {
                _this.data = keys.todo;
                for (var i=0; i<_this.data.length; i++) {
                    _this.data[i]['id'] = i + 1;
                }
                console.log(_this.data);
                callback(_this.data);
            }
        });
    }
    /**
     * Syncs to the <code>chrome.storage</code>
     * @version 1.0.1
     */
    this.sync = function() {
        chrome.storage.sync.set({todo: this.data}, function() {
            console.log('Data is stored in Chrome storage');
        });
    }
    /**
     * Adds data to the <code>chrome.storage</code>
     * @param {string} newContent The content of the todo item
     * @param {object} newTags The tags of the todo item
     * @param {boolean} isCompleted If the todo item is completed
     * @param {string} importance The importance of the todo item
     * @version 1.0.1
     */
    this.add = function (newContent, newTags, isCompleted, importance) {
        var id = this.data.length + 1;
        var todo = {
            id: id,
            content: newContent,
            completed: isCompleted,
            createdAt: new Date(),
            tags: newTags,
            importance: importance
        };
        this.data.push(todo);
        this.sync();
    }
    /**
     * Removes data from the <code>chrome.storage</code>
     * @param {any} todo The todo item to remove
     * @version 1.0.1
     */
    this.remove = function(todo) {
        this.data.splice(this.data.indexOf(todo), 1);
        this.sync();
    }
    /**
     * Removes all data from the <code>chrome.storage</code>
     * @version 1.0.1
     */
    this.removeAll = function() {
        this.data = [];
        this.sync();
    }
});