define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        search: function () {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {
            router.map([
                { route: '', title: 'Операции', moduleId: 'viewmodels/action' },
                { route: 'login', title: 'Авторизация', moduleId: 'viewmodels/login' },
                { route: 'register', title: 'Регистрация', moduleId: 'viewmodels/register' },
                { route: '404', title: '404', moduleId: 'viewmodels/404' },
                { route: 'source', title: 'Счета', moduleId: 'viewmodels/source' },
                { route: 'category', title: 'Категории', moduleId: 'viewmodels/category' },
                { route: 'report', title: 'Отчеты', moduleId: 'viewmodels/report' }

            ]);
            return router.activate();
        }
    };
});