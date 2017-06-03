"use strict";
$(function () {
    $(".signup").on("click", function () {
        if (!$("#divEmail").length) {
            createElement();
        }
        else {
        }
    });
    $(".signin").on("click", function () {
        if ($("#divEmail").length) {
            removeElement();
        }
    });
});
function createElement() {
    $("#formContent").hide();
    var div = document.createElement("div");
    div.className = "form-group";
    div.id = "divEmail";
    var label = document.createElement("label");
    label.className = "label";
    label.innerHTML = "CORREO ELECTRÓNICO";
    div.appendChild(label);
    var input = document.createElement("input");
    input.className = "input";
    input.type = "text";
    input.name = "email";
    input.placeholder = "Correo Electrónico";
    div.appendChild(input);
    $("#formContent").prepend(div);
    $(".signin").text("Iniciar Sesión");
    $(".signup").text("Enviar");
    $("#formContent").slideToggle();
}
function removeElement() {
    $("#formContent").hide();
    $("#divEmail").remove();
    $(".signup").text("Registrarse");
    $(".signin").text("Enviar");
    $("#formContent").slideToggle();
}
