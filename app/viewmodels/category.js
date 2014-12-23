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
                validate:modalDataValidate
            },
            form:{
                addClick:addClick,
                removeClick:removeClick,
                updateClick:updateClick
            },
            categories:ko.observableArray(),
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
            dataContext.getList('category').then(function (categories) {
                viewModel.categories(categories);
            });
        }

        function addClick() {
            viewModel.modal.title('Создание категории');
            viewModel.modalData.name('');
            viewModel.modalData.objectId('');
            viewModel.modal.show();
        }

        function removeClick(category) {
            if (confirm('Точно удалить?')) {
                viewModel.remove(category);
            }
        }

        function updateClick(category) {
            viewModel.modal.title('Редактирование категории');
            viewModel.modalData.name(category.name);
            viewModel.modalData.objectId(category.objectId);
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

        function remove(category) {
            dataContext.remove('category', category.objectId).then(function () {
                loadList();
            }).catch(function (e) {
                    messageHelper.show('Произошла ошибка', 'error');
                });
        }

        function add() {
            viewModel.modal.process(true);
            var data = {
                name:viewModel.modalData.name(),
            };

            if (userContext.session) {
                var acl = {};
                acl[userContext.session.objectId] = {
                    "read":true,
                    "write":true
                };
                data.ACL = acl;
            }

            dataContext.add('category', data).then(function (objectId) {
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
                name:viewModel.modalData.name()
            };
            dataContext.update('category', data).then(function () {
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