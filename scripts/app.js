var WatchDogApp = angular.module('WatchDogApp', []);

WatchDogApp.controller('DataController', function DataController($scope) {


    $scope.activeSession = false;
    $scope.session = localStorage.getItem("watch_dog_session");

    if ($scope.session) {
        $scope.session = JSON.parse($scope.session);
        $scope.activeSession = true;
        $scope.lstDevices = [];

        var dispositivos = {};
        var dispositivoSeleccionado = null;
        var statusRelay = true;
        var lblResultado = document.getElementById("lblResultado");

        api.call("Get", {
            "typeName": "Device"
        }, function (result) {

            var lstDevice = document.getElementById("vehiculos");
            var lstStatusRelay = document.getElementById("statusRelay");
            var enviarStatusRelay = document.getElementById("btnEnviarStatusRelay");

            lstStatusRelay.addEventListener('change', getstatusRelay);
            enviarStatusRelay.addEventListener('click', enviaStatusRelay);

            /****************************************************/
            result.forEach(function (device) {

                lstDevice.add(crearItem(device.name, device.id));
                dispositivos[device.id] = device;
            });
            lstDevice.addEventListener('click', getDevice);

        }, function (error) {
            console.log(error);
        });
        var crearItem = function (texto, id) {
            var option = document.createElement("option");
            option.text = texto;
            option.value = id;
            return option;

        }
        var getDevice = function () {
            try {
                dispositivoSeleccionado = this.value;
                console.log(dispositivoSeleccionado);
            } catch (error) {
                console.error(error.message);
            }
        }
        var getstatusRelay = function () {
            statusRelay = this.value;
            console.log(statusRelay);
        }
        var enviaStatusRelay = function () {
            dispositivoSeleccionado = document.getElementById("vehiculos").value;
            if (dispositivoSeleccionado != null) {
                api.call("Add", {
                    "typeName": "TextMessage",
                    "entity": {
                        device: {
                            id: dispositivoSeleccionado
                        },
                        messageContent: {
                            isRelayOn: statusRelay,
                            contentType: "IoxOutput"
                        },
                        isDirectionToVehicle: true
                    }
                }, function (result) {
                    if (statusRelay === "true") {
                        swal({
                            text: 'Se activo paro de motor en la unidad ' +
                                dispositivos[dispositivoSeleccionado].name

                        })
                        console.log("Se " + (statusRelay === "true" ? "activo" : "desactivo") + " paro de motor en la unidad:" + dispositivos[dispositivoSeleccionado].name);
                        //lblResultado.innerHTML = "Se " + (statusRelay === "true" ? "activo" : "desactivo") + " paro de motor en la unidad:" + dispositivos[dispositivoSeleccionado].name;

                    } else
                    if (statusRelay === "false") {
                        swal({
                            text: 'Se desactivo paro de motor en la unidad ' + dispositivos[dispositivoSeleccionado].name

                        })
                        console.log("Se " + (statusRelay === "true" ? "activo" : "desactivo") + " paro de motor en la unidad:" + dispositivos[dispositivoSeleccionado].name);
                        // lblResultado.innerHTML = "Se " + (statusRelay === "true" ? "activo" : "desactivo") + " paro de motor en la unidad:" + dispositivos[dispositivoSeleccionado].name;

                    }


                }, function (e) {
                    console.error("Failed:", e);
                    lblResultado.text = "No fue posible " + (statusRelay === "true" ? "activar" : "desactivar") + " paro de motor en la unidad:" + dispositivos[dispositivoSeleccionado].name;

                });
            }
        }

    } else {
        api.getSession(function (credentials, server) {
            localStorage.setItem("watch_dog_session", JSON.stringify(api));
            api = api;
        });
    }

});