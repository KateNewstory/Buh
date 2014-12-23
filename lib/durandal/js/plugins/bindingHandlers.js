define(['knockout', 'jquery'], function (ko, $) {
    return {
        install:function () {
            ko.bindingHandlers.numeric = {
                init:function (element, valueAccessor) {
                    $(element).on("keydown", function (event) {
                        // Allow: backspace, delete, tab, escape, and enter
                        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                            // Allow: Ctrl+A
                            (event.keyCode == 65 && event.ctrlKey === true) ||
                            // Allow: . ,
                            (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) ||
                            // Allow: home, end, left, right
                            (event.keyCode >= 35 && event.keyCode <= 39)) {
                            // let it happen, don't do anything
                            return;
                        }
                        else {
                            // Ensure that it is a number and stop the keypress
                            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                                event.preventDefault();
                            }
                        }
                    });
                }
            };
            ko.bindingHandlers.alert = {
                update:function (element, valueAccesor) {
                    var value = valueAccesor();

                    if (value() != '') {
                        $(element).text(value()).fadeIn().delay(1000).fadeOut();
                        value('');
                    }

                }
            };

            ko.bindingHandlers.fadeVisible = {
                init:function (element, valueAccessor) {
                    var value = valueAccessor();
                    $(element).toggle(ko.unwrap(value));
                },
                update:function (element, valueAccessor) {
                    var value = valueAccessor();
                    ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
                }
            };
        }
    };
});
