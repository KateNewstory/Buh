define(['knockout', 'plugins/router', 'userContext', 'helpers/messageHelper'], function (ko, router, userContext, messageHelper) {

    var viewModel = {
        email: ko.observable(),
        password: ko.observable(),
        submit: submit,

        canActivate: canActivate
    }

    return viewModel;

    function canActivate() {
        if (userContext.session) {
            return { redirect: '' };
        }

        return true;
    }

    function submit() {
        userContext.login(viewModel.email(), viewModel.password())
            .then(function () {
                router.navigate('');
            })
            .catch(function () {
                messageHelper.show('Не удалось авторизоваться', 'error');
            });
    }

})