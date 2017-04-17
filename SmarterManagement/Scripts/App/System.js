function System() {

    System.prototype.setCheckbox = function ($cbx, val) {

        if (val) {
            $cbx.bootstrapToggle('on');
        } else {
            $cbx.bootstrapToggle('off');
        }

    };

    System.prototype.validateField = function ($field, isValid) {

        var valid = isValid;
        if ($field.val() !== undefined) {
            if ($.trim($field.val()) === '') {
                $field.parent('div').addClass('has-error').removeClass('has-success');
                valid = false;
            } else {
                $field.parent('div').addClass('has-success').removeClass('has-error');
            }
        }
        return valid;

    };

    System.prototype.cleanValidateField = function ($field) {

        if ($field.val() !== undefined) {
            $field.parent('div').removeClass('has-error').removeClass('has-success');
            $field.val('');
        }

    };

    System.prototype.cleanValidateButton = function ($button) {

        if ($button !== undefined) {
            System.prototype.disabled($button, 'false');
        }

    };

    System.prototype.exist = function ($field, $exist, $btn) {

        if ($exist === 'True') {
            $field.parent('div').addClass('has-error').removeClass('has-success');
            System.prototype.disabled($btn, 'true');
        } else {
            $field.parent('div').addClass('has-success').removeClass('has-error');
            System.prototype.disabled($btn, 'false');
        }

    };

    /*
     * success
     * info
     * warning
     * danger
     */
    System.prototype.alert = function ($message, $type, $time) {

        var $messageTag = $('.alerts-message');
        var $alertTag = $('.alert-main');
        $alertTag.removeClass('alert-success').removeClass('alert-info').removeClass('alert-warning').removeClass('alert-danger');

        if ($type === 'success') {
            $alertTag.addClass('alert-success');
        } else if ($type === 'info') {
            $alertTag.addClass('alert-info');
        } else if ($type === 'warning') {
            $alertTag.addClass('alert-warning');
        } else if ($type === 'danger') {
            $alertTag.addClass('alert-danger');
        }
        if ($time === undefined) {
            $time = 2;
        }
        $messageTag.text($message);
        $time = parseInt($time) * 1000;
        $alertTag.fadeIn().delay(parseInt($time)).fadeOut();

    };

    System.prototype.getRow = function ($value) {

        var $row = '';
        $row = "<td>" + $value + "</td>";
        return $row;

    };

    System.prototype.getColumn = function ($value) {

        var $row = '';
        $row = "<tr>" + $value + "</tr>";
        return $row;

    };
    System.prototype.getColumn = function ($value, pclass, pdata) {


        var $row = '';
        $row = "<tr class='"+pclass+"' "+pdata+">" + $value + "</tr>";
        return $row;

    };

    

    System.prototype.getDivRow = function ($value) {

        var $row = '';
        $row = "<div class='row'>" + $value + "</div>";
        return $row;

    };

    /*
     * true
     * false
     */
    System.prototype.disabled = function ($field, $val) {

        if ($val === 'true') {
            $field.prop("disabled", true);
        } else if ($val === 'false') {
            $field.prop("disabled", false);
        }

    };

}