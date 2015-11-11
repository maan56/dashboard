describe('Controller: AuthenticationDomainController', function() {

    var $scope;
    var $controller,
        httpBackend,
        authenticationService,
        deferred,
        q,
        errorHandler,
        currentUser;

    beforeEach(module('ui.router'));
    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.manage.settings.authentication.domain'));

    beforeEach(module('qorDash.loaders', function($provide) {
        $provide.constant("AUTH_API_URL", "https://accounts.qor.io/v1");
        $provide.constant("Notification", "1");
    }));

    beforeEach(function() {
        authenticationService = {
            response : {
                data: {
                    "domain": "blinker.com"
                }
            },

            getDomainInfo: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };

        errorHandler = {
            showError: function() {
                return false;
            }
        };

        currentUser = {
            then: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };
    });

    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _user_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();

            spyOn($state, 'go').and.returnValue(true);
            _$controller_('AuthenticationDomainController', {$scope: $scope, authenticationService: authenticationService, errorHandler: errorHandler, currentUser: currentUser});
        })
    });


    it('should populate the domain var when loadDomain is called', function() {
        spyOn(authenticationService, 'getDomainInfo').and.callThrough();

        $scope.loadDomain();

        $scope.token = 'token';
        $scope.$apply();

        deferred.resolve(authenticationService.response);

        $scope.$root.$digest();

        expect(authenticationService.getDomainInfo).toHaveBeenCalled();
        expect($scope.domain).toBe(authenticationService.response.data);
    });
});
