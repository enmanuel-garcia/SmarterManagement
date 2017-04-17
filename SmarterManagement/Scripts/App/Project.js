var $bot = new Project();
$bot.Init();

function Project() {

    Project.prototype.Init = function () {

        /*Find*/
        $btnFind = $('.btnProyectFind');
        $txtFind = $("#txtFind");

        /*Modal Edit*/
        $loadProject = $('.edit-loading');
        $editModal = $('#editModal');
        $txtEditName = $('#editName');
        $txtEditStartDate = $('#editStartDate');
        $btnEditSave = $('#editSave');
        $findAlert = $('.alert-main');

        /*Modal New*/
        $newModal = $('#newModal');
        $txtNewName = $('#newName');
        $txtNewStartDate = $('#newStartDate');
        $btnNewSave = $('#newSave');

        /*Table*/
        $table = $('.table-Proyect');
        $tableBtnEdit = $('.editProyect');
        $tableBtnDelete = $('.deleteProject');

        /*Other*/
        $btnProjectAdd = $('.btnProyecttAdd');

        /*Init*/
        $loadProject.hide();
        $findAlert.hide();
        $table.hide();

        $system = new System();

        $btnFind.on('click touchstart', function () {

            if ($btnFind.is(':disabled') === false) {
                Project.prototype.Find();
            }

        });

        $btnEditSave.on('click touchstart', function () {

            var $btnUpdate = $(this);
            if ($btnUpdate.is(':disabled') === false) {
                Project.prototype.Update();
            }

        });

        $btnProjectAdd.on('click touchstart', function () {

            $system.cleanValidateField($txtNewStartDate);
            $system.cleanValidateField($txtNewName);
            $txtNewStartDate.val('');
            $txtNewName.val('');
            

        });

        $btnNewSave.on('click touchstart', function () {

            Project.prototype.Add();

        });

        $txtEditName.blur(function () {

            var $name = $(this).val();
            var $id = parseInt($btnEditSave.attr('data-id'));
            Project.prototype.Exist($name, $id, $(this), $btnEditSave);

        });

        $txtNewName.blur(function () {

            var $name = $(this).val();
            Project.prototype.Exist($name, 0, $(this), $btnNewSave);

        });

    };

    Project.prototype.Find = function () {

        $btnFind.button('loading');
        var name = $txtFind.val();
        var url = '/Project/Finder';
        var parameters = { 'name': name };
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            data: parameters,
            success: function (data) {
                $('tbody:last', $table).children().remove();
                if (data !== '[]') {
                    $table.fadeIn();
                    var $json = jQuery.parseJSON(data);
                    $.each($json, function (index, item) {
                        var $row = '';
                        var $edit = $table.attr('data-edit');
                        if ($edit === 'True') {
                            $row += $system.getRow(
                            "<span style='padding: 0;' class='glyphicon glyphicon-pencil btn editProject' aria-hidden='true' data-id='" + item.id + "' data-toggle='modal' data-target='#editModal'></span>" + 
                            "<span style='padding-left: 5px;' class='glyphicon glyphicon-remove btn text-danger deleteProject' aria-hidden='true' data-id='" + item.id + "'></span>"
                            );
                        }
                        $row += $system.getRow(item.name);
                        var startDate = new Date(item.startDate);
                        startDate.setDate(startDate.getDate() + 1);
                        $row += $system.getRow(startDate.toLocaleDateString())
                        $row = $system.getColumn($row);
                        $('tbody:last-child', $table).append($row);
                    });
                } else {
                    $table.hide();
                }
                Project.prototype.ReloadTable();
                $tableBtnEdit.on('click touchstart', function () {
                    $txtEditName.val('');
                    $txtEditStartDate.val('');
                    Project.prototype.Load($(this));
                });
                $tableBtnDelete.on('click touchstart', function () {
                    var $btn = $(this);
                    swal({
                        title: "Eliminar",
                        text: "El proyecto se va a eliminar permanentemente!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Si, Eliminarlo!",
                        cancelButtonText: "No",
                        closeOnConfirm: false
                    },
                    function () {
                        Project.prototype.delete($btn);
                    });
                });
            }
        }).always(function () {
            $btnFind.button('reset');
        });

    };

    Project.prototype.Load = function ($btn) {

        $system.cleanValidateField($txtEditName);
        $system.cleanValidateField($txtEditStartDate)
        $system.cleanValidateButton($btnEditSave);
        $loadProject.show();
        $system.disabled($btnEditSave, 'true');
        var id = parseInt($btn.attr("data-id"));
        var url = '/Project/Get';
        var parameters = { 'id': id };
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            data: parameters,
            success: function (data) {
                if (data !== '[]') {
                    var $json = jQuery.parseJSON(data);
                    var $startDate = new Date($json.startDate).toJSON().substring(0, 10);
                    $txtEditName.val($json.name);
                    $txtEditStartDate.val($startDate);
                    $btnEditSave.attr('data-id', $json.id);
                }
            }
        }).always(function () {
            $system.disabled($btnEditSave, 'false');
            $loadProject.hide();
        });

    };

    Project.prototype.Update = function () {

        var isValid = true;
        isValid = $system.validateField($txtEditName, isValid);
        isValid = $system.validateField($txtEditStartDate, isValid);
        if (isValid) {
            $btnEditSave.button('loading');
            var $id = parseInt($btnEditSave.attr("data-id"));
            var $name = $txtEditName.val();
            var $startDate = $txtEditStartDate.val();
            var url = '/Project/Set';
            var parameters = { 'id': $id, 'name': $name, 'startDate': $startDate };
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'html',
                data: parameters,
                success: function (data) {
                    if (data === 'True') {
                        $editModal.modal('hide');
                        Project.prototype.Find();
                        $system.alert('El proyecto se actualizó', 'success');
                    } else {
                        $editModal.modal('hide');
                        $system.alert('No se pudo realizar la actualización, favor contacte al administrador', 'danger', 8);
                    }
                }
            }).always(function () {
                $btnEditSave.button('reset');
            });
        }

    };

    Project.prototype.Add = function ($btnAdd) {

        var isValid = true;
        isValid = $system.validateField($txtNewName, isValid);
        if (isValid) {
            $btnNewSave.button('loading');
            var $name = $txtNewName.val();
            var $startDate = $txtNewStartDate.val();
            var url = '/Project/Add';
            var parameters = { 'name': $name, 'startDate': $startDate };
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'html',
                data: parameters,
                success: function (data) {
                    if (data === 'True') {
                        $newModal.modal('hide');
                        Project.prototype.Find();
                        $system.alert('El proyecto se agregó', 'success');
                    } else {
                        $system.alert('No se pudo agregar el proyecto, favor contacte al administrador', 'danger', 8);
                    }
                }
            }).always(function () {
                $btnNewSave.button('reset');
            });
        }

    };

    Project.prototype.delete = function ($btn) {

        var id = parseInt($btn.attr("data-id"));
        var url = '/Project/Delete';
        var parameters = { 'id': id };
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            data: parameters,
            success: function (data) {
                if (data === 'True') {
                    swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    Project.prototype.Find();
                }
            }
        }).always(function () {
        });

    };

    Project.prototype.Exist = function ($name, $id, $field, $btn) {

        var $result = true;
        var url = '/Project/Exist';
        var parameters = { 'name': $name, 'id': $id };
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            data: parameters,
            success: function ($data) {
                $system.exist($field, $data, $btn);
            }
        });

    };

    Project.prototype.ReloadTable = function () {

        $tableBtnEdit = $('.editProject');
        $tableBtnDelete = $('.deleteProject');

    };

}