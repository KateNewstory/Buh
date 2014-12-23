define(['Q', 'plugins/http'], function (Q, http) {

    var userContext = {
        login: login,
        register: register,

        session: null
    }

    return userContext;

    function register(fullname, email, password) {
        var dfd = Q.defer();

        var url = 'https://api.parse.com/1/users/';
        var headers = {
            "X-Parse-Application-Id": "WeRcYiOoebRX7toTNXDxpLBdgUF0lbR4kHrRpIXe",
            "X-Parse-REST-API-Key": "WUZssJuNnh10Wq9A1DJ2Y2MB6AvCyXPQuCOhO6BX"
        }

        var user = {
            fullname: fullname,
            username: email,
            password: password
        };

        http.post(url, user, headers)
            .done(function () {
                dfd.resolve();
            })
            .fail(function () {
                dfd.reject();
            });

        return dfd.promise;
    }

    function login(email, password) {
        var dfd = Q.defer();

        var url = 'https://api.parse.com/1/login/';
        var headers = {
            "X-Parse-Application-Id": "WeRcYiOoebRX7toTNXDxpLBdgUF0lbR4kHrRpIXe",
            "X-Parse-REST-API-Key": "WUZssJuNnh10Wq9A1DJ2Y2MB6AvCyXPQuCOhO6BX"
        }

        var user = {
            username: email,
            password: password
        };

        http.get(url, user, headers)
            .done(function (response) {
                if (response) {
                    userContext.session = response;
                    dfd.resolve();
                } else {
                    dfd.reject();
                }
                
            })
            .fail(function () {
                dfd.reject();
            });

        return dfd.promise;
    }

});