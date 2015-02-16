var contactController=function($scope) {
	$scope.title="Contacts";
	$scope.edit=false;
	$scope.operation="Ajouter un contact";
	$scope.contacts=[{nom:"ZUCKERBERG",prenom:"Mark",email:"mark@facebook.com"},
	                 {nom:"GATES",prenom:"Bill",email:"bill@microsoft.com"},
	                 {nom:"JOBS",prenom:"Steeve",email:"Steeve@apple.com"}];
	this.contact=null;
	
	$scope.update=function(){
		if($scope.contact==null)
			this.contacts.push($scope.tmpContact);
		else{
			angular.copy($scope.tmpContact, this.contact);
		}
		$scope.contact=null;
		$scope.edit=false;
	};
	
	$scope.toUpdate=function(contact){
		$scope.operation="Modifier un contact";
		$scope.contact=contact;
		$scope.tmpContact=angular.copy(contact);
		$scope.edit=true;
	};
	
	$scope.toAdd=function(){
		$scope.operation="Ajouter un contact";
		$scope.contact=null;
		$scope.tmpContact={};
		$scope.edit=true;
	};
	
	$scope.delete=function(contact){
		var index = this.contacts.indexOf(contact);
		this.contact.deleted=true;
		//this.contacts.splice(index, 1);
		$scope.edit=false;
	};
	
	$scope.cancelOne=function(){
		angular.forEach($scope.contacts,function(contact){
			if(contact.deleted===true){ 
				contact.deleted=false;
			}
		});
	}
	
	this.edit=function(c){
		$scope.contact=c;
		$scope.txtNom=c.nom;$scope.txtPrenom=c.prenom;$scope.txtEmail=c.email;
		$scope.edit=true;
	}
};
module.exports=contactController;