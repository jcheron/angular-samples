angular.module('ng').service('CalcService', ["$cookies",function($cookies) {
	this.gui={screen:"0",operateur:undefined,result:undefined,on:true};
	this.ops=[
	            {value:'('},
	            {value:')'},
	            {value:'M'},
	            {value:' '},
	            {value:'RM'},
	            {value:'Off',cssClass:"btn-danger",title:"Eteindre la calculatrice"},
	            {value:'\n'},
	            {value:"⇤"},
	            {value:"CE"},
	            {value:"C"},
	            {value:" "},
	            {value:"±"},
	            {value:"√x"},
	            {value:"\n"},
	            {value:7},
	            {value:8},
	            {value:9},
	            {value:' '},
	            {value:'/'},
	            {value:'%'},
	            {value:'\n'},
	            {value:4},
	            {value:5},
	            {value:6},
	            {value:' '},
	            {value:'*'},
	            {value:'1/x'},
	            {value:'\n'},
	            {value:1},
	            {value:2},
	            {value:3},
	            {value:' '},
	            {value:'-'},
	            {value:'\n'},
	            {value:0,cssClass:"colspan btn-default"},
	            {value:'.',cssClass:"btn-default"},
	            {value:' '},
	            {value:'+'},
	            {value:'=',cssClass:"rowspan btn-success",title:"Calculer ([ENTREE]) !"}
	            ];
	var isOperateur=function(element){
		return parseInt(element)!=element && element!="." && element!="⇤" && element!="(" && element!=")";
	};
	var calc=function(obj){
		var isError=false;
		try {
			obj.gui.result=eval(obj.gui.screen.replace('√','Math.sqrt').replace(/^0+/g,''));
		} catch (e) {
			isError=true;
		}
		return isError;
	};
	this.add=function(element){
		if(this.gui.screen==0)
			this.gui.screen="";
		switch (element) {
		case 'Off':
			this.gui.on=false;
			$cookies.memory=undefined;
			this.gui.screen="";
			this.gui.result=undefined;
			break;
		case "M":
			if(this.gui.result)
				$cookies.memory=this.gui.result+"";
			break;
		case "RM":
			if($cookies.memory){
				this.gui.screen+=$cookies.memory;
				calc(this);
			}
			break;
		case '=':
			if(this.gui.result)
				this.gui.screen=this.gui.result;
			break;
		case '1/x':
			if(this.gui.result){
				this.gui.screen="1/("+this.gui.screen+")";
				this.gui.result=1/this.gui.result;
			}
			break;
		case '√x':
			if(this.gui.result){
				this.gui.screen="√("+this.gui.screen+")";
				this.gui.result=Math.sqrt(this.gui.result);
			}
			break;
		case '%':
			if(this.gui.result){
				this.gui.screen="("+this.gui.screen+")/100";
				this.gui.result=this.gui.result/100;
			}
			break;
		case "⇤":
			this.gui.screen=(this.gui.screen+"").substring(0,(this.gui.screen+"").length-1);
			calc(this);
			break;
		case "±":
			var value;
			var exp=/(\-{0,1}(\d|\.)+)$/g;
			this.gui.screen=this.gui.screen+"";
			var match=exp.exec(this.gui.screen);
			if(match){
				try{
					if(match[1].substring(0,1)=="-")
						value=eval("+"+match[1].substring(1));
					else
						value=eval("-"+match[1]);
				}catch(e){}
				if(value)
					this.gui.screen=this.gui.screen.replace(exp,value);
			}
				
			calc(this);
			break;
		case ".":
			var value;
			var exp=/(\-{0,1}(\d|\.)+)$/g;
			this.gui.screen=this.gui.screen+"";
			var match=exp.exec(this.gui.screen);
			if(match){
				try{
					if(match[1].indexOf(".")!=-1)
						return;
				}catch(e){}
			}
			this.gui.operateur=undefined;
			this.gui.screen+=element;
			calc(this);
			break;
		case "CE":
			this.gui.screen=(this.gui.screen+"").replace(/((\d|\.)+)$/g,"");
			calc(this);
			break;
		case "C":
			this.gui.screen="0";
			this.gui.result=undefined;
			this.gui.operateur=undefined;
			break;
		default:
			if(isOperateur(element)){
				if(this.gui.operateur)
					this.gui.screen=(this.gui.screen+"").substring(0,(this.gui.screen+"").length-1);
				this.gui.operateur=element;
			}else
				this.gui.operateur=undefined;
		this.gui.screen+=element;
			calc(this);
			break;
		}
	};
	this.setOn=function(){
		this.gui.on=true;
		this.screen="0";
		this.result=undefined;
	};
} ]);