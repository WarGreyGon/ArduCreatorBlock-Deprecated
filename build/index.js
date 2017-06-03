"use strict";
$(function () {
    $(".Signup").on("click", function () {
        if (!$("#divRegisterInput").length) {
            createElement();
        }
        else {
        }
    });
    $(".Signin").on("click", function () {
        if ($("#divRegisterInput").length) {
            removeElement();
        }
    });
});
function createElement() {
    $("#formContent").hide();
    var div = document.createElement("div");
    div.className = "form-group";
    div.id = "divRegisterInput";
    var label = document.createElement("label");
    label.className = "Label";
    label.innerHTML = "CORREO ELECTRÓNICO";
    div.appendChild(label);
    var input = document.createElement("input");
    input.className = "Input";
    input.type = "text";
    input.name = "email";
    input.placeholder = "Correo Electrónico";
    div.appendChild(input);
    $("#formContent").prepend(div);
    $(".Signin").text("Iniciar Sesión");
    $(".Signup").text("Enviar");
    $("#formContent").slideToggle();
}
function removeElement() {
    $("#formContent").hide();
    $("#divRegisterInput").remove();
    $(".Signup").text("Registrarse");
    $(".Signin").text("Enviar");
    $("#formContent").slideToggle();
}
