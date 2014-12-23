define([], function () {

    var messageHelper = {
        show:show
    }

    return messageHelper;

    function show(msg, type) {
        alert(msg);
    }
})