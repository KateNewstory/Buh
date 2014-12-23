define(['knockout', 'userContext', 'plugins/router', 'helpers/messageHelper'], function (ko, userContext, router, messageHelper) {

    var viewModel = {
        fullname:ko.observable(),
        email:ko.observable(),
        password:ko.observable(),

        submit:submit,
        canActivate:canActivate
    }

    return viewModel;

    function canActivate() {
        if (userContext.session) {
            return { redirect:'' };
        }

        return true;
    }

    function submit() {
        userContext.register(viewModel.fullname(), viewModel.email(), viewModel.password())
            .then(function () {
                router.navigate('');
            })
            .catch(function () {
                messageHelper.show('Не удалось авторизоваться', 'error');
            })
    }

})