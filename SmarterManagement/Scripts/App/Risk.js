var $bot = new Risk();
$bot.Init();

function Risk() {

    Risk.prototype.Init = function () {

        /*Find*/
        $btnFind = $('.btnRiskFind');
        $txtFind = $("#txtFind");

        /*\ Edit*/
        $loadRisk = $('.edit-loading');
        $editModal = $('#editModal');
        $txtEditName = $('#editName');
        $txtEditDescription = $('#editDescription');
        $txtEditProbability = $('#EditProbability');
        $txtEditImpact = $('#editImpact');
        $txtEditPriority = $('#editPriority');
        $btnEditSave = $('#editSave');
        $findAlert = $('.alert-main');

        /*Modal New*/
        $newModal = $('#newModal');
        $txtNewName = $('#newName');
        $txtNewDescription = $('#newDescription');
        $txtNewProbability = $('#newProbability');
        $txtNewImpact = $('#newImpact');
        $txtNewPriority = $('#newPriority');
        $btnNewSave = $('#newSave');

        /*Table*/
        $table = $('.table-Risk');
        $tableBtnEdit = $('.editRisk');
        $tableBtnDelete = $('.deleteRisk');

        /*Other*/
        $btnRiskAdd = $('.btnRiskAdd');

        /*Init*/
        $loadRisk.hide();
        $findAlert.hide();
        $table.hide();

        /*Table Project */
        $tableProyect = $('.table-Proyect');

        $system = new System();

        $btnFind.on('click touchstart', function () {

            if ($btnFind.is(':disabled') === false) {
                Risk.prototype.Find();
            }

        });

        $btnEditSave.on('click touchstart', function () {

            var $btnUpdate = $(this);
            if ($btnUpdate.is(':disabled') === false) {
                Risk.prototype.Update();
            }

        });

        $btnRiskAdd.on('click touchstart', function () {
            $system.cleanValidateField($txtNewName);
            $txtNewName.val('');
        });

        $btnNewSave.on('click touchstart', function () {

            Risk.prototype.Add();

        });

        $txtEditName.blur(function () {

            var $name = $(this).val();
            var $id = parseInt($btnEditSave.attr('data-id'));
            Risk.prototype.Exist($name, $id, $(this), $btnEditSave);

        });

        $txtNewName.blur(function () {

            var $name = $(this).val();
            Risk.prototype.Exist($name, 0, $(this), $btnNewSave);

        });

        //Load the initial Proyects
        Risk.prototype.ProjectsLoad();
    };

    Risk.prototype.Find = function (projectId) {

        $btnFind.button('loading');
        var name = $txtFind.val();
        var url = '/Risk/Finder';
        var parameters = { 'projectId': projectId };
        var $id = parseInt($btnEditSave.attr("data-id"));
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
                            "<span style='padding: 0;' class='glyphicon glyphicon-pencil btn editRisk' aria-hidden='true' data-id='" + item.id + "' data-toggle='modal' data-target='#editModal'></span>" +
                            "<span style='padding-left: 5px;' class='glyphicon glyphicon-remove btn text-danger deleteRisk' aria-hidden='true' data-id='" + item.id + "'></span>"
                            );
                        }
                        $row += $system.getRow(item.name);
                        $row += $system.getRow(item.description);
                        $row += $system.getRow(item.probability);
                        $row += $system.getRow(item.impact);
                        $row += $system.getRow(item.priority);
                        var color;
                        
                        if (item.priority <= dataMatrix.Limits[0].Value)
                            color = 'bg-success'
                        else if (item.priority <= dataMatrix.Limits[1].Value)
                            color = 'bg-warning'
                        else
                            color = 'bg-danger'
                       
                        $row = $system.getColumn($row, color);

                        $('tbody:last-child', $table).append($row);
                    });
                } else {
                    $table.hide();
                }
                Risk.prototype.ReloadTable();
                $tableBtnEdit.on('click touchstart', function () {
                    $txtEditName.val('');
                    $txtEditDescription.val('');
                    $txtEditProbability.val('');
                    $txtEditImpact.val('');
                    $txtEditPriority.val('');
                    Risk.prototype.Load($(this));

                });
                $tableBtnDelete.on('click touchstart', function () {
                    var $btn = $(this);
                    swal({
                        title: "Eliminar",
                        text: "El riesgo se va a eliminar permanentemente!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Si, Eliminarlo!",
                        cancelButtonText: "No",
                        closeOnConfirm: false
                    },
                    function () {
                        Risk.prototype.delete($btn);
                    });
                });
            }
        }).always(function () {
            $btnFind.button('reset');
        });

    };

    Risk.prototype.Load = function ($btn) {

        $system.cleanValidateField($txtEditName);
        $system.cleanValidateField($txtEditDescription)
        $system.cleanValidateField($txtEditProbability);
        $system.cleanValidateField($txtEditImpact);
        $system.cleanValidateField($txtEditPriority);
        $system.cleanValidateButton($btnEditSave);
        $loadRisk.show();
        $system.disabled($btnEditSave, 'true');
        var id = parseInt($btn.attr("data-id"));
        var url = '/Risk/Get';
        var parameters = { 'id': id };
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            data: parameters,
            success: function (data) {
                if (data !== '[]') {
                    var $json = jQuery.parseJSON(data);
                    $txtEditName.val($json.name);
                    $txtEditDescription.val($json.description);
                    $txtEditProbability.val($json.probability);
                    $txtEditImpact.val($json.impact);
                    $txtEditPriority.val($json.priority);
                    $btnEditSave.attr('data-id', $json.id);
                }
            }
        }).always(function () {
            $system.disabled($btnEditSave, 'false');
            $loadRisk.hide();
        });

    };

    Risk.prototype.Update = function () {

        var isValid = true;
        isValid = $system.validateField($txtEditName, isValid);
        isValid = $system.validateField($txtEditDescription, isValid);
        isValid = $system.validateField($txtEditProbability, isValid);
        isValid = $system.validateField($txtEditImpact, isValid);
        //isValid = $system.validateField($txtEditPriority, isValid);
        if (isValid) {
            $btnEditSave.button('loading');
            var $id = parseInt($btnEditSave.attr("data-id"));
            var $name = $txtEditName.val();
            var $description = $txtEditDescription.val();
            var $probability = $txtEditProbability.val();
            var $impact = parseInt($txtEditImpact.val());
            var $priority = 0;// $txtEditPriority.val();
            var url = '/Risk/Set';
            var parameters = { 'id': $id, 'name': $name, 'description': $description, 'probability': $probability, 'impact': $impact, 'priority': $priority };
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'html',
                data: parameters,
                success: function (data) {
                    if (data === 'True') {
                        $editModal.modal('hide');
                        var id = parseInt($(".btnRiskFind.active").attr("data-id"));
                        Risk.prototype.Find(id);
                        $system.alert('El riesgo se actualizó', 'success');
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

    Risk.prototype.Add = function ($btnAdd) {

        var isValid = true;
        isValid = $system.validateField($txtNewName, isValid);
        if (isValid) {
            $btnNewSave.button('loading');
            var $name = $txtNewName.val();
            var $description = $txtNewDescription.val();
            var $probability = $txtNewProbability.val();
            var $impact = parseInt($txtNewImpact.val());
            var projectId= $(".btn.btnRiskFind.active").attr('data-id');
            var url = '/Risk/Add';
            var parameters = { 'name': $name, 'description': $description, 'probability': $probability, 'impact': $impact, 'priority': 0,'projectId':projectId };
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'html',
                data: parameters,
                success: function (data) {
                    if (data === 'True') {
                        $newModal.modal('hide');
                        var id = parseInt($(".btnRiskFind.active").attr("data-id"));
                        Risk.prototype.Find(id);
                        $system.alert('El riesgo se agregó', 'success');
                    } else {
                        $system.alert('No se pudo agregar el riesgo, favor contacte al administrador', 'danger', 8);
                    }
                }
            }).always(function () {
                $btnNewSave.button('reset');
            });
        }

    };

    Risk.prototype.delete = function ($btn) {

        var id = parseInt($btn.attr("data-id"));
        var url = '/Risk/Delete';
        var parameters = { 'id': id };
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'html',
            data: parameters,
            success: function (data) {
                if (data === 'True') {
                    swal("Deleted!", "Your imaginary file has been deleted.", "success");
                    var id = parseInt($(".btnRiskFind.active").attr("data-id"));
                    Risk.prototype.Find(id);
                }
            }
        }).always(function () {
        });

    };

    Risk.prototype.Exist = function ($name, $id, $field, $btn) {

        var $result = true;
        var url = '/Risk/Exist';
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

    Risk.prototype.ReloadTable = function () {

        $tableBtnEdit = $('.editRisk');
        $tableBtnDelete = $('.deleteRisk');

    };

    /* Project code*/

    Risk.prototype.ProjectsLoad = function () {

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
                $('tbody:last', $tableProyect).children().remove();
                if (data !== '[]') {
                    $tableProyect.fadeIn();
                    var $json = jQuery.parseJSON(data);
                    $.each($json, function (index, item) {
                        var $row = '';
                        var $edit = $tableProyect.attr('data-edit');
                        if ($edit === 'True') {
                            $row += $system.getRow(
                            "<span style='padding: 0;' class='glyphicon glyphicon-pencil btn editProject' aria-hidden='true' data-id='" + item.id + "' data-toggle='modal' data-target='#editModal'></span>" +
                            "<span style='padding-left: 5px;' class='glyphicon glyphicon-remove btn text-danger deleteProject' aria-hidden='true' data-id='" + item.id + "'></span>"
                            );
                        }
                        $row += $system.getRow(item.name, "findRisks");
                        //$row += $system.getRow(startDate.toLocaleDateString())
                        var data = 'data-id= "' + item.id + '"';
                        $row = $system.getColumn($row, 'btn btnRiskFind', data);
                        //$row = "<a class='btnRiskFind'>" + $row + "</a>";
                        $('tbody:last-child', $tableProyect).append($row);

                    });
                } else {
                    $tableProyect.hide();
                }

                Risk.prototype.ProjectsReloadTable();
                $btnFind.on('click touchstart', function () {
                    if ($btnFind.is(':disabled') === false) {
                        $(".btnRiskFind").removeClass("active");
                        $(this).addClass("active")
                        var id = parseInt($(this).attr("data-id"));
                        Risk.prototype.Find(id);

                    }
                });
            }
        }).always(function () {
            $btnFind.button('reset');
        });

    };

    Risk.prototype.ProjectsReloadTable = function () {

        $btnFind = $('.btnRiskFind');

    };
}