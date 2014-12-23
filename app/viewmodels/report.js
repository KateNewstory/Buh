define(['knockout', 'userContext', 'dataContext', 'plugins/router', 'helpers/messageHelper', 'plugins/bindingHandlers'],
    function (ko, userContext, dataContext, router, messageHelper) {

        var viewModel = {

            canActivate:canActivate
        }

        return viewModel;

        function canActivate() {
            if (!userContext.session) {
                return { redirect:'login' };
            }

            return true;
        }
    })