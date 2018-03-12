(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'UsersService', 'PasswordValidator'];

  function UserController($scope, $state, $window, Authentication, user, Notification, UsersService, PasswordValidator) {
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.user = user;
    vm.user.birDate = new Date(vm.user.birDate);
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;
    

    vm.disciplines = getDisciplines();

    function getDisciplines() {
      UsersService.getArticles()
        .then(function (response) {
          vm.disciplines = response;
        }, function (error) {
        });
    }

    $scope.CheckVissibleInputs = function () {    
        if (($scope.vm.user.roles == 'admin') || ($scope.vm.user.roles == 'user')) {
          $scope.vissibleAdmin = true;
          $scope.vissibleClient = false;
          $scope.vm.user.disciplines = ' ';
          $scope.vm.user.username = '';

        } else {
            $scope.vissibleAdmin = false;
            $scope.vissibleClient = true;
            $scope.vm.user.username = vm.user.dni;
            $scope.vm.user.password = '';
            //$scope.vm.credentials.username = $scope.vm.credentials.dni;
            //$scope.vm.credentials.password = 'Mario123..';
        }
    }

    $scope.cancel = function () {
      $state.go('admin.user', {
          userId: user._id
      });
    }

    function remove(user) {
      if ($window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');


        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
    init(); 

    function init () {
      if (vm.authentication.user.roles == 'admin') {
        $scope.showRoles = true;
      } 
      if (vm.user.roles == 'client') {
        $scope.vissibleClient = true;
      } else {
        $scope.vissibleAdmin = true;
        $scope.vissiblePass = false;
      }
    }
  }
}());
