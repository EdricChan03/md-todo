window.angular = angular;
angular.module('MdTodoApp', ['ngAnimate', 'ngAria', 'ngMaterial', 'ngMessages'])
    .config(['$mdIconProvider', function ($mdIconProvider) {
        $mdIconProvider.defaultIconSet('src/mdi.svg');
    }])
    .controller('TodoController', ['$scope', '$rootScope', 'todoStorage', 'settingsStorage', '$mdDialog', '$mdConstant', '$mdToast', function ($scope, $rootScope, todoStorage, settingsStorage, $mdDialog, $mdConstant, $mdToast) {
        /**
         * Checks if <code>$scope.checkTodo</code> is present
         * @version 1.0.1
         */
        $scope.checkTodo = function () {
            if ($scope.todoList.length > 0) {
                return false;
            } else {
                return true;
            }
        }
        $scope.todoStorage = todoStorage;
        $scope.$watch('todoStorage.data', function () {
            $scope.todoList = $scope.todoStorage.data;
        });
        $scope.todoStorage.findAll(function (data) {
            $scope.todoList = data;
            $scope.$apply();
        });
        $scope.add = function () {
            console.log($scope.importance);
            todoStorage.add($scope.newContent, $scope.newTags, $scope.markAsComplete, $scope.importance);
            $scope.newContent = '';
            $scope.newTags = [];
            $scope.markAsComplete = false;
            $scope.importance = '';
        }
        $scope.remove = function (todo) {
            todoStorage.remove(todo);
        }
        $scope.removeAll = function (ev) {
            var confirmRemoveAll = $mdDialog.confirm()
                .title('Are you sure?')
                .textContent('Are you sure that you want to delete all the todos? This can\'t be undone!')
                .ariaLabel('Confirm Dialog')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirmRemoveAll).then(function () {
                // If user clicked yes
                todoStorage.removeAll();
            }, function () {
                // If user clicked no
            })
        }
        $scope.done = function () {
            todoStorage.sync();
        }
        $scope.newTodo = function (ev) {
            $mdDialog.show({
                controller: NewTodoCtrl,
                templateUrl: './src/partials/newtodo.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (answer) {
                todoStorage.add(answer.newContent, answer.newTags, answer.markAsComplete, answer.importance);
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Todo item added')
                        .position('bottom right')
                        .hideDelay(3000)
                );
            }, function () {
                console.log('User cancelled');
            })
        }
        function NewTodoCtrl($scope, $mdDialog, $mdConstant) {
            /**
             * Sets the keys when typed will add a new chip
             * @version 1.0.1
             */
            $scope.chipKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
            $scope.newTags = [];
            $scope.close = function () {
                $mdDialog.hide();
            }
            $scope.cancel = function () {
                $mdDialog.hide();
            }
            $scope.importanceOpts = [
                { text: "High Importance", val: "high" },
                { text: "Medium Importance", val: "med" },
                { text: "Low Importance", val: "low" }
            ]
            $scope.add = function (answer) {
                console.log(JSON.stringify(answer));
                $mdDialog.hide(answer);
            }
        }

    }])
    .controller('ButtonsController', ['$scope', 'settingsStorage', '$mdToast', '$mdDialog', function ($scope, settingsStorage, $mdToast, $mdDialog) {
        /**
         * Closes the extension window
         * @version 1.0.0
         */
        $scope.closeWindow = function () {
            window.close();
        }
        /**
         * Opens the chrome extension in a new tab
         * @version 1.0.0
         */
        $scope.openNewTab = function () {
            window.open(chrome.runtime.getURL('popup.html'));
        }
        /**
         * Opens the chrome extension src on Github
         * @version 1.0.0
         */
        $scope.viewGithub = function () {
            window.open('https://github.com/Chan4077/md-todo');
        }
        /**
         * Opens the settings dialog
         * @param {any} ev The event of the click
         * @version 1.0.1
         */
        $scope.preferences = function (ev) {
            $mdDialog.show({
                controller: PreferencesController,
                templateUrl: '/src/partials/settings.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true,
                multiple: true
            })
                .then(function (answer) {
                    var settings = JSON.stringify(answer);
                    console.info('Settings is: ' + settings);
                    if (answer.showDebug) {
                        console.log('User chose to show debug messages.');
                        console.debug('Saving to localStorage...');
                    } else {
                        console.log('User chose to not show debug messages.');
                    }
                    localStorage.setItem('settings', settings);
                })
        }

        /*
        * Application dialogs
        */
        function PreferencesController($scope, $mdDialog, $mdToast) {
            $scope.hide = function () {
                $mdDialog.hide();
            }
            $scope.cancel = function () {
                $mdDialog.cancel();
            }
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            }
            /**
             * Clears the preferences from <code>localStorage</code>
             * @param {any} ev The event of the click
             * @version 1.0.1
             */
            $scope.clearPrefs = function (ev) {
                var confirm = $mdDialog.confirm()
                    .title('Confirmation')
                    .textContent('Are you sure you want to clear settings? This can\'t be undone!')
                    .ariaLabel('Confirm clear')
                    .targetEvent(ev)
                    .ok('OK')
                    .cancel('Cancel')
                    .multiple(true);

                $mdDialog.show(confirm).then(function () {
                    localStorage.removeItem('settings');
                }, function () {
                    // nothing much
                });
            }
            // Set settings to `localStorage ➡> settings` or an array
            $scope.settings = JSON.parse(localStorage.getItem('settings')) || {};
        }
    }])