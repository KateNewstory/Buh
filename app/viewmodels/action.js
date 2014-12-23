define(['knockout', 'userContext', 'dataContext', 'plugins/router', 'helpers/messageHelper', 'plugins/bindingHandlers'],
    function (ko, userContext, dataContext, router, messageHelper) {

        var viewModel = {
            today:'',
            sources:ko.observableArray(),
            categories:ko.observableArray(),

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
                type:ko.observable(),
                date:ko.observable(),
                category:ko.observableArray(),
                source:ko.observableArray(),
                money:ko.observable(),
                comment:ko.observable(),
                validate:modalDataValidate
            },

            actions:ko.observableArray(),
            add:add,
            update:update,
            remove:remove,
            canActivate:canActivate,
            activate:activate,
            form:{
                addClick:addClick,
                removeClick:removeClick,
                updateClick:updateClick
            }
        }

        return viewModel;

        function canActivate() {
            if (!userContext.session) {
                return { redirect:'login' };
            }
            return true;
        }

        function activate() {
            var now = new Date();
            viewModel.today = now.format("yyyy-mm-dd");
            loadCategories();
            loadSources();
            return loadList();


        }

        function loadList() {
            dataContext.getList('action', {'order':'-createdAt', 'include':'category_id'}).then(function (actions) {
                viewModel.actions(actions);
            });
        }

        function loadCategories() {
            dataContext.getList('category').then(function (categories) {

                viewModel.categories(categories);
            });
        }

        function loadSources() {
            dataContext.getList('source').then(function (sources) {
                viewModel.sources(sources);
            });
        }

        function addClick(type) {
            if (type == '+') {
                viewModel.modal.title('Потрачено');
            } else {
                viewModel.modal.title('Получено');
            }

            viewModel.modalData.type(type);
            viewModel.modalData.date(viewModel.today);
            /*viewModel.modalData.category([]);
            viewModel.modalData.source([]);*/
            viewModel.modalData.money(0);
            viewModel.modalData.comment('');
            viewModel.modalData.objectId('');
            viewModel.modal.show();
        }

        function removeClick(action) {
            if (confirm('Точно удалить?')) {
                viewModel.remove(action);
            }
        }

        function updateClick(action, type) {
            viewModel.modal.title('Редактирование');
            viewModel.modalData.type(type);
            viewModel.modalData.category(action.category);
            viewModel.modalData.source(action.source);
            viewModel.modalData.money(action.money);
            viewModel.modalData.comment(action.comment);
            viewModel.modalData.objectId(action.objectId);
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
            if (viewModel.modalData.date() && parseFloat(viewModel.modalData.money()) > 0) {
                return true;
            } else {
                messageHelper.show('Заполните обязательные поля', 'error');
                return false;
            }
        }

        function remove(action) {
            dataContext.remove('action', action.objectId).then(function () {
                loadList();
            }).catch(function (e) {
                    messageHelper.show('Произошла ошибка', 'error');
                });
        }

        function add() {
            viewModel.modal.process(true);
            console.log(viewModel.modalData.source());
            var data = {
                type:viewModel.modalData.type(),
                date:viewModel.modalData.date(),
                source_id:viewModel.modalData.source()[0],
                category_id:viewModel.modalData.category()[0],
                money:parseFloat(viewModel.modalData.money()),
                comment:viewModel.modalData.comment()
            };

            if (userContext.session) {
                var acl = {};
                acl[userContext.session.objectId] = {
                    "read":true,
                    "write":true
                };
                data.ACL = acl;
            }
            console.log(data);
            dataContext.add('action', data).then(function (objectId) {
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
                type:viewModel.modalData.type(),
                date:viewModel.modalData.date(),
                source_id:viewModel.modalData.source()[0],
                category_id:viewModel.modalData.category()[0],
                money:parseFloat(viewModel.modalData.money()),
                comment:viewModel.modalData.comment()
            };
            dataContext.update('action', data).then(function () {
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