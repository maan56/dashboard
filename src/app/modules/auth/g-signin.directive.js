(function () {
    'use strict';

    angular.module('qorDash.auth')
        .directive('gSignin', gSingin);

    function gSingin() {
        var ending = /\.apps\.googleusercontent\.com$/;

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs, ctrl, linker) {
            var auth2;
            var clientId = attrs.clientId;

            if (!clientId) {
                return;
            }

            clientId += (ending.test(clientId) ? '' : '.apps.googleusercontent.com');

            gapi.load('auth2', function(){
                auth2 = gapi.auth2.init({
                    client_id: clientId,
                    cookiepolicy: 'single_host_origin'
                });

                auth2.attachClickHandler(document.getElementById(element.attr('id')), {}, successLogin, failedLogin);
            });
        }

        function successLogin(googleUser) {
            console.log(googleUser);
            document.getElementById('app').innerText = "Signed in: " + JSON.stringify(googleUser);
            $rootScope.$broadcast('event:google-signin-success', googleUser);
        }

        function failedLogin (error) {
            console.log(error);
            document.getElementById('app').innerText = "Signed in: " + JSON.stringify(error);
            $rootScope.$broadcast('event:google-signin-failure', authResult);
        }
    }
})();