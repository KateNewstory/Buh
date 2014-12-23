define(['knockout', 'userContext', 'dataContext', 'plugins/router', 'helpers/messageHelper', 'plugins/bindingHandlers'],
    function (ko, userContext, dataContext, router, messageHelper) {

    var viewModel = {
        modal:{
            title:ko.observable(),
            visible:ko.observable(false),
            process:ko.observable(false),

            show:modalShow,
            close:modalClose,
            save:modalSave
        },
        modalData:{
            objectId:ko.observable(),
            name:ko.observable(),
            money:ko.observable(),
            validate:modalDataValidate
        },
        form:{
            addClick:addClick,
            removeClick:removeClick,
            updateClick:updateClick
        },
        sources:ko.observableArray(),
        canActivate:canActivate,
        activate:activate,
        loadList:loadList,
        add:add,
        update:update,
        remove:remove
    }

    return viewModel;

    function canActivate() {
        if (!userContext.session) {
            return { redirect:'login' };
        }
        return true;
    }

    function activate() {
        return loadList();
    }

    function loadList() {
        dataContext.getList('source').then(function (sources) {
            viewModel.sources(sources);
        });
    }

    function addClick() {
        viewModel.modal.title('Создание счета');
        viewModel.modalData.name('');
        viewModel.modalData.money(0);
        viewModel.modalData.objectId('');
        viewModel.modal.show();
    }

    function removeClick(source) {
        if (confirm('Точно удалить?')) {
            viewModel.remove(source);
        }
    }

    function updateClick(source) {
        viewModel.modal.title('Редактирование счета');
        viewModel.modalData.name(source.name);
        viewModel.modalData.money(source.money);
        viewModel.modalData.objectId(source.objectId);
        viewModel.modal.show();
    }

    function modalShow() {
        viewModel.modal.visible(true);
    }

    function modalClose() {
        viewModel.modal.visible(false);
    }

    function modalSave() {
        if (viewModel.modalData.validate()) {
            if (!viewModel.modalData.objectId()) {
                viewModel.add();
            } else {
                viewModel.update();
            }
        }
    }

    function modalDataValidate() {
        if (viewModel.modalData.name()) {
            return true;
        } else {
            messageHelper.show('Заполните название счета', 'error');
            return false;
        }
    }

    function remove(source) {
        dataContext.remove('source', source.objectId).then(function () {
            loadList();
        }).catch(function (e) {
                messageHelper.show('Произошла ошибка', 'error');
            });
    }

    function add() {
        viewModel.modal.process(true);
        var data = {
            name:viewModel.modalData.name(),
            money:parseFloat(viewModel.modalData.money())
        };

        if (userContext.session) {
            var acl = {};
            acl[userContext.session.objectId] = {
                "read":true,
                "write":true
            };
            data.ACL = acl;
        }

        dataContext.add('source', data).then(function (objectId) {
            loadList();
            viewModel.modal.close();
            viewModel.modal.process(false);
        }).catch(function (e) {
                viewModel.modal.close();
                messageHelper.show('Произошла ошибка', 'error');
                viewModel.modal.process(false);

            });
    }

    function update() {
        viewModel.modal.process(true);
        var data = {
            objectId:viewModel.modalData.objectId(),
            name:viewModel.modalData.name(),
            money:parseFloat(viewModel.modalData.money())
        };
        dataContext.update('source', data).then(function () {
            loadList();
            viewModel.modal.close();
            viewModel.modal.process(false);
        }).catch(function (e) {
                viewModel.modal.close();
                messageHelper.show('Произошла ошибка', 'error');
                viewModel.modal.process(false);

            });
    }
})