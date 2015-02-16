var noteApp=angular.module("NoteApp", []);
angular.module("NoteApp").controller("NoteController", require("./controller"));
module.exports=noteApp.name;