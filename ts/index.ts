$(function(){
    $(".Signup").on("click", function(){
        if(!$("#divRegisterInput").length){
            createElement();
        }
        else
        {

        }
    });
    $(".Signin").on("click", function(){
        if($("#divRegisterInput").length){
            removeElement();
        }
    });
});

function createElement() :void{
    $("#formContent").hide();
    $("#formBox").css("margin-top", "0");
    var divEmail = createDiv("divRegisterInput");
    var labelEmail = createLabel("CORREO ELECTRÓNICO");
    divEmail.appendChild(labelEmail);
    var inputEmail = createInput("email", "Correo Electrónico");
    divEmail.appendChild(inputEmail);
    $("#formContent").prepend(divEmail);

    var divRepeatPass = createDiv("divRepeatPass");
    var labelPassword = createLabel("REPITA LA CONTRASEÑA");
    divRepeatPass.appendChild(labelPassword);
    var inputPassword = createInput("passwordRepeat", "Repita la Contraseña");
    divRepeatPass.appendChild(inputPassword);
    insert(divRepeatPass, document.getElementById("password"));

    $(".Signin").text("Iniciar Sesión");
    $(".Signup").text("Enviar");
    $("#formContent").slideToggle();
}
function removeElement() :void{
    $("#formContent").hide();
    $("#formBox").css("margin-top", "6%");
    $("#divRegisterInput").remove();
    $("#divRepeatPass").remove();
    $(".Signup").text("Registrarse");
    $(".Signin").text("Enviar");
    $("#formContent").slideToggle();
}
function createDiv(id: string) : HTMLElement{
    var div = document.createElement("div");
    div.className = "form-group";
    div.id = id;
    return div;
}
function createLabel(name: string) :HTMLElement{
    var label = document.createElement("label");
    label.className = "Label";
    label.innerHTML = name;
    return label;
}
function createInput(name: string, placeholder: string) :HTMLElement{
    var input = document.createElement("input");
    input.className = "Input";
    input.type = "text";
    input.name = name;
    input.placeholder = placeholder;
    return input;
}
function insert(newNode :HTMLElement, referenceNode:HTMLElement) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}