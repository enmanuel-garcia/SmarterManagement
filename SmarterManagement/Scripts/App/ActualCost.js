var $bot = new ActualCost();
$bot.Init();

function ActualCost() {

    ActualCost.prototype.Init = function () {

        /*Find*/
        $btnFind = $('.btnAcFind');
        $txtFind = $("#ddlProjects");

        /*Modal Edit*/
        $loadAc = $('.edit-loading');
        $editModal = $('#editModal');
        $editProject = $('#editProject');
        $editRisk = $('#editRisk');
        $editCode = $('#editCode');
        $editWbsCode = $('#editWbsCode');
        $editTbc = $('#editTbc');
        $editDescription = $('#editDescription');
        $btnEditSave = $('#editSave');
        $findAlert = $('.alert-main');

        /*Modal New*/
        $newModal = $('#newModal');
        $newProject = $('#newProject');
        $newRisk = $('#newRisk');
        $newCode = $('#newCode');
        $newWbsCode = $('#newWbsCode');
        $newTbc = $('#newTbc');
        $newDescription = $('#newDescription');
        $btnNewSave = $('#newSave');
        
        /*Table*/
        $table = $('.table-Ac');
        $tableBtnEdit = $('.editAcy');
        $tableBtnDelete = $('.deleteAc');

        /*Other*/
        $btnActAdd = $('.btnAcAdd');

        /*Init*/
        $loadAc.hide();
        $findAlert.hide();
        $table.hide();

        $system = new System();

        $btnFind.on('click touchstart', function () {

            if ($btnFind.is(':disabled') === false) {
                ActualCost.prototype.Find();
            }

        });

        $btnEditSave.on('click touchstart', function () {

            var $btnUpdate = $(this);
            if ($btnUpdate.is(':disabled') === false) {
                ActualCost.prototype.Update();
            }

        });

        $btnActAdd.on('click touchstart', function () {

            $system.cleanValidateField($newProject);
            $system.cleanValidateField($newRisk);
            $system.cleanValidateField($newCode);
            $system.cleanValidateField($newWbsCode);
            $system.cleanValidateField($newTbc);
            $system.cleanValidateField($newDescription);
            $newProject.val('');
            $newRisk.val('');
            $newCode.val('');
            $newWbsCode.val('');
            $newTbc.val('');
            $newDescription.val('');

        });

        $btnNewSave.on('click touchstart', function () {

            ActualCost.prototype.Add();

        });

        $editCode.blur(function () {

            var $name = $(this).val();
            var $id = parseInt($btnEditSave.attr('data-id'));
            ActualCost.prototype.Exist($name, $id, $(this), $btnEditSave);

        });

        $newCode.blur(function () {

            var $name = $(this).val();
            ActualCost.prototype.Exist($name, 0, $(this), $btnNewSave);

        });

        $newProject.change(function () {

            ActualCost.prototype.Risk($newProject, $newRisk);
            
        });

        $editProject.change(function () {

            ActualCost.prototype.Risk($editProject, $editRisk);

        });

        ActualCost.prototype.Project();

    };

    ActualCost.prototype.Find = function () {

        $btnFind.button('loading');
        var idProject = $txtFind.val();
        var url = '/ActualCost/Finder';
        var parameters = { 'idProject': idProject };
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
                            "<span style='padding: 0;' class='glyphicon glyphicon-pencil btn editAc' aria-hidden='true' data-id='" + item.id + "' data-toggle='modal' data-target='#editModal'></span>" +
                            "<span style='padding-left: 5px;' class='glyphicon glyphicon-remove btn text-danger deleteAc' aria-hidden='true' data-id='" + item.id + "'></span>"
                            );
                        }
                        $row += $system.getRow(item.wbsCode);
                        $row += $system.getRow(item.code);
                        $row += $system.getRow(item.description);
                        $row += $system.getRow(item.risk.name);
                        $row += $system.getRow(item.tbc);
                        $row = $system.getColumn($row);
                        $('tbody:last-child', $table).append($row);
                    });
                } else {
                    $table.hide();
                }
                ActualCost.prototype.ReloadTable();
                $tableBtnEdit.on('click touchstart', function () {
                    $editProject.val('');
                    $editRisk.val('');
                    $editCode.val('');
                    $editDescription.val('');
                    ActualCost.prototype.Load($(this));
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
                        ActualCost.prototype.delete($btn);
                    });
                });
            }
        }).always(function () {
            $btnFind.button('reset');
        });

    };

    ActualCost.prototype.Load = function ($btn) {

        $system.cleanValidateField($editProject);
        $system.cleanValidateField($editRisk);
        $system.cleanValidateField($editCode);
        $system.cleanValidateField($editWbsCode);
        $system.cleanValidateField($editTbc);
        $system.cleanValidateField($editDescription);
        $system.cleanValidateButton($btnEditSave);
        $loadAc.show();
        $system.disabled($btnEditSave, 'true');
        var id = parseInt($btn.attr("data-id"));
        var url = '/ActualCost/Get';
        var parameters = { 'id': id };
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            data: parameters,
            success: function (data) {
                if (data !== '[]') {
                    var $json = jQuery.parseJSON(data);
                    $editProject.val($json.idProyect);
                    $editRisk.val($json.risk.id);
                    $editCode.val($json.code);
                    $editWbsCode.val($json.wbsCode);
                    $editTbc.val($json.tbc);
                    $editDescription.val($json.description);
                    $btnEditSave.attr('data-id', $json.id);
                }
            }
        }).always(function () {
            $system.disabled($btnEditSave, 'false');
            $loadAc.hide();
        });

    };

    ActualCost.prototype.Update = function () {

        var isValid = true;
        isValid = $system.validateField($editProject, isValid);
        isValid = $system.validateField($editRisk, isValid);
        isValid = $system.validateField($editCode, isValid);
        isValid = $system.validateField($editWbsCode, isValid);
        isValid = $system.validateField($editTbc, isValid);
        isValid = $system.validateField($editDescription, isValid);
        if (isValid) {
            $btnEditSave.button('loading');
            var $id = parseInt($btnEditSave.attr("data-id"));
            var $idProject = $editProject.val();
            var $idRisk = $editRisk.val();
            var $code = $editCode.val();
            var $tbc = $editTbc.val();
            var $wbsCode = $editWbsCode.val();
            var $description = $editDescription.val();
            var url = '/ActualCost/Set';
            var parameters = { 'id': $id, 'idProject': $idProject, 'idRisk': $idRisk, 'code': $code, 'wbsCode': $wbsCode, 'tbc': $tbc, 'description': $description };
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'html',
                data: parameters,
                success: function (data) {
                    if (data === 'True') {
                        $editModal.modal('hide');
                        ActualCost.prototype.Find();
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

    ActualCost.prototype.Add = function ($btnAdd) {

        var isValid = true;
        isValid = $system.validateField($newProject, isValid);
        isValid = $system.validateField($newRisk, isValid);
        isValid = $system.validateField($newCode, isValid);
        isValid = $system.validateField($newWbsCode, isValid);
        isValid = $system.validateField($newTbc, isValid);
        isValid = $system.validateField($newDescription, isValid);
        if (isValid) {
            $btnNewSave.button('loading');
            var $idProject = $newProject.val();
            var $idRisk = $newRisk.val();
            var $code = $newCode.val();
            var $wbsCode = $newWbsCode.val();
            var $tbc = $newTbc.val();
            var $description = $newDescription.val();
            var url = '/ActualCost/Add';
            var parameters = { 'idProject': $idProject, 'idRisk': $idRisk, 'code': $code, 'wbsCode': $wbsCode, 'tbc': $tbc, 'description': $description };
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'html',
                data: parameters,
                success: function (data) {
                    if (data === 'True') {
                        $newModal.modal('hide');
                        ActualCost.prototype.Find();
                        $system.alert('La actividad se agregó', 'success');
                    } else {
                        $system.alert('No se pudo agregar la actividad, favor contacte al administrador', 'danger', 8);
                    }
                }
            }).always(function () {
                $btnNewSave.button('reset');
            });
        }

    };

    ActualCost.prototype.delete = function ($btn) {

        var id = parseInt($btn.attr("data-id"));
        var url = '/ActualCost/Delete';
        var parameters = { 'id': id };
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            data: parameters,
            success: function (data) {
                if (data === 'True') {
                    swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    ActualCost.prototype.Find();
                }
            }
        }).always(function () {
        });

    };

    ActualCost.prototype.Exist = function ($name, $id, $field, $btn) {

        var $result = true;
        var url = '/ActualCost/Exist';
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

    ActualCost.prototype.ReloadTable = function () {

        $tableBtnEdit = $('.editAc');
        $tableBtnDelete = $('.deleteAc');

    };

    ActualCost.prototype.Project = function () {

        var url = '/ActualCost/Projects';
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            success: function (data) {
                if (data !== '[]') {
                    var $dropDownList = $('.ddlProjects');
                    var $json = jQuery.parseJSON(data);
                    $.each($json, function (index, item) {
                        $dropDownList.append($("<option></option>").attr("value", item.id).text(item.name));
                    });
                    ActualCost.prototype.Risk($newProject, $newRisk);
                    ActualCost.prototype.Risk($editProject, $editRisk);
                }
            }
        });

    };

    ActualCost.prototype.Activity = function ($ddlProyect, $ddlRisk) {

        var url = '/ActualCost/Risks';
        var $idProject = parseInt($ddlProyect.val());
        var parameters = { 'idProject': $idProject};
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            data: parameters,
            success: function (data) {
                if (data !== '[]') {
                    var $json = jQuery.parseJSON(data);
                    $ddlRisk.html("");
                    $.each($json, function (index, item) {
                        $ddlRisk.append($("<option></option>").attr("value", item.id).text(item.name));
                    });
                }
            }
        });

    };
    
}
