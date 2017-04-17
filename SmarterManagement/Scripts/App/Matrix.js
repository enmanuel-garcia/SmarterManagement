var $bot = new Matrix();

$bot.Init();

function Matrix() {
    var $probabilityImpactMatrix = $('.probability-impact-matrix'),
        $lowLimit = $('#lowLimit'),
        $midLimit = $('#midLimit'),
        pathname = window.location.pathname.toLowerCase(),
        dataMatrixUpdated = {};

    Matrix.prototype.Init = function () {        
        $lowLimit.val(dataMatrix.Limits[0].Value);
        $midLimit.val(dataMatrix.Limits[1].Value);
        Matrix.prototype.ConstructorMatrix()
        if (pathname === '/parameters' || pathname === '/parameters/' || pathname === '/parameters/index')
            Matrix.prototype.ConstructorParameters()

        $('#probabilitiesContainer').on('click touchstart', '.remove-parameter', function (event) {
            event.preventDefault();
            $(event.currentTarget).parents('.probability').remove()
        })

        $('#impactsContainer').on('click touchstart', '.remove-parameter', function (event) {
            event.preventDefault();
            $(event.currentTarget).parents('.impact').remove()
        })

        $('#addProbability').on('click touchstart', function (event) {
            Matrix.prototype.AddParameter('p')
        })

        $('#addImpact').on('click touchstart', function (event) {
            Matrix.prototype.AddParameter('i')
        })

        $('#updateMatrix').on('click touchstart', function (event) {
            Matrix.prototype.UpdateMatrixInfo()
        })
    }
    
    Matrix.prototype.ConstructorParameters = function () {
        var htmlParameter,
            $probabilitiesContainer = $('#probabilitiesContainer'),
            $impactsContainer = $('#impactsContainer');
        
        $.each(dataMatrix.Probabilities, function (index, probability) {
            htmlParameter = '<div class="form-group probability">' +
                              '<div class="row">' +
                                  '<div class="col-sm-6">' +
                                      '<input type="text" class="form-control probability-name" placeholder="nombre" value="' + probability.Name + '">' +
                                  '</div>' +
                                  '<div class="col-sm-5">' +
                                      '<input type="number" class="form-control probability-value" placeholder="valor" min="1" max="99" value="' + probability.Value + '">' +
                                  '</div>' +
                                  '<div class="col-sm-1">' +
                                      '<button id="removeProbability' + index + '" type="button" class="close remove-parameter">×</button>' +
                                  '</div>' +
                              '</div>' +
                          '</div>';

            $probabilitiesContainer.append(htmlParameter)
        })

        $.each(dataMatrix.Impacts, function (index, impact) {
            htmlParameter = '<div class="form-group impact">' +
                              '<div class="row">' +
                                  '<div class="col-sm-6">' +
                                      '<input type="text" class="form-control impact-name" placeholder="nombre" value="' + impact.Name + '">' +
                                  '</div>' +
                                  '<div class="col-sm-5">' +
                                      '<input type="number" class="form-control impact-value" placeholder="valor" min="1" max="99" value="' + impact.Value + '">' +
                                  '</div>' +
                                  '<div class="col-sm-1">' +
                                      '<button id="removeImpact' + index + '" type="button" class="close remove-parameter">×</button>' +
                                  '</div>' +
                              '</div>' +
                          '</div>';

            $impactsContainer.append(htmlParameter)
        })
    }

    Matrix.prototype.ConstructorMatrix = function () {
        var htmlMatrixRow,
            valueRisk;
        
        $.each(dataMatrix.Probabilities, function (index, probability) {
            htmlMatrixRow = '<div class="matrix-row">' +
                            '<div><span>' + probability.Name + '</span></div>' +
                            '<div><span>' + probability.Value + '%</span></div>';

            $.each(dataMatrix.Impacts, function (index, impact) {
                valueRisk = (probability.Value * impact.Value).toFixed(0);

                htmlMatrixRow += '<div class="' +
                                    (valueRisk <= dataMatrix.Limits[0].Value ? 'bg-success' : valueRisk <= dataMatrix.Limits[1].Value ? 'bg-warning' : 'bg-danger') +
                                        '"><span>' + valueRisk + '</span></div>'
            })

            htmlMatrixRow += '</div>';
            $probabilityImpactMatrix.append(htmlMatrixRow)
        })

        for (var i = 0; i < 2; i++) {
            htmlMatrixRow = '<div class="matrix-row">' +
                            '<div class="not-show"><span></span></div>' +
                            '<div class="not-show"><span></span></div>';

            $.each(dataMatrix.Impacts, function (index, impact) {
                htmlMatrixRow += '<div><span>' + (i === 0 ? impact.Value : impact.Name) + '</span></div>'
            })

            htmlMatrixRow += '</div>';
            $probabilityImpactMatrix.append(htmlMatrixRow)
        }
    }

    Matrix.prototype.UpdateMatrixInfo = function () {
        var probabilityName, probabilityValue, impactName, impactValue;
        dataMatrixUpdated = {
            Probabilities: [],
            Impacts: [],
            Limits: []
        }

        dataMatrixUpdated.Limits.push({ Value: parseInt($lowLimit.val()) });
        dataMatrixUpdated.Limits.push({ Value: parseInt($midLimit.val()) });

        $.each($('.probability'), function (index, probability) {
            probabilityName = $('.probability-name', probability).val();
            probabilityValue = $('.probability-value', probability).val();
            if (probabilityName != '' && probabilityValue != '')
                dataMatrixUpdated.Probabilities.push({ Name: probabilityName, Value: probabilityValue })
        })

        $.each($('.impact'), function (index, impact) {
            impactName = $('.impact-name', impact).val();
            impactValue = $('.impact-value', impact).val();
            if (impactName != '' && impactValue != '')
                dataMatrixUpdated.Impacts.push({ Name: impactName, Value: impactValue })
        })

        $.when(Matrix.prototype.UpdateMatrix()).then(function (status) {
            if (status) {
                dataMatrix = jQuery.extend(true, {}, dataMatrixUpdated);
                $probabilityImpactMatrix.empty()
                Matrix.prototype.ConstructorMatrix()
            }
        })
    }

    Matrix.prototype.AddParameter = function (parameterType) {
        var idContainer,
            wrapperClass,
            htmlParameter,
            idInput;

        if (parameterType === 'p') {
            idContainer = '#probabilitiesContainer';
            wrapperClass = 'probability';
            removeButtonId = 'removeProbability';
            idInput = 'probability';
        } else {
            idContainer = '#impactsContainer';
            wrapperClass = 'impact';
            removeButtonId = 'removeImpact';
            idInput = 'impact';
        }
        
        htmlParameter = '<div class="form-group ' + wrapperClass + '">' +
                            '<div class="row">' +
                                '<div class="col-sm-6">' +
                                    '<input type="text" class="form-control ' + idInput + '-name" placeholder="nombre">' +
                                '</div>' +
                                '<div class="col-sm-5">' +
                                    '<input type="number" class="form-control ' + idInput + '-value" placeholder="valor" min="1" max="99">' +
                                '</div>' +
                                '<div class="col-sm-1">' +
                                    '<button id="' + removeButtonId + $('.wrapperClass').length + '" type="button" class="close remove-parameter">×</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

        $(idContainer).append(htmlParameter)
    }

    Matrix.prototype.UpdateMatrix = function () {
        var dfd = jQuery.Deferred();
        
        var ajax = $.ajax({
            url: '/Parameters/UpdateMatrix',
            type: 'POST',
            dataType: 'json',
            data: { 'matrix': JSON.stringify(dataMatrixUpdated) }
        })

        ajax.complete(function (response) {
            if (response.status === 200) {
                dfd.resolve(true)
            } else {
                console.error('No se logró actualizar la matriz.');
                dfd.resolve(false)
            }
        })

        return dfd.promise()
    }
}