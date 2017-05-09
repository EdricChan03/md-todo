angular.module('MdTodoApp').service('settingsStorage', function ($q) {
    var _this = this;
    this.data = [];
    /**
     * Finds from all of the storage data
     * @param {any} callback
     * @todo Find out what this does
     * @version 1.0.1
     */
    this.findAll = function (callback) {
        chrome.storage.sync.get('settings', function (keys) {
            if (keys.settings != null) {
                _this.data = keys.settings;
                console.log(_this.data);
                callback(_this.data);
            }
        });
    }
    /**
     * Syncs to the <code>chrome.storage</code>
     * @version 1.0.1
     */
    this.sync = function () {
        chrome.storage.sync.set({ settings: this.data }, function () {
            console.log('Data is stored in Chrome storage');
        });
    }
    /**
     * Adds data to the <code>chrome.storage</code>
     * @param {object} settings The settings
     * @version 1.0.1
     */
    this.add = function (settings) {
        this.data.push(settings);
        this.sync();
    }
    /**
     * Removes all data from the <code>chrome.storage</code>
     * @version 1.0.1
     */
    this.removeAll = function () {
        this.toRemove = [];
        chrome.storage.sync.get('settings', function (items) {
            console.log(items);
            Array.prototype.forEach.call(items, function (index, value) {
                this.toRemove.push(index);
            })
            alert(JSON.stringify(this.toRemove));
            // this.data = [];
            // this.sync();
            console.log('Removed');
            chrome.storage.sync.remove(this.data, function (items) {
                alert('Removed!');
                chrome.storage.sync.get('settings', function (items) {
                    Array.prototype.forEach.call(items, function (index, value) {
                        alert(index);
                    })
                })
            });
        });
    };
});