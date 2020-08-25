var rate = 0;
var isRateCorrect = false;
var message = "Getting rates...";
var userId;

function onLoad(){
	console.log("\n Web app is starting \n");
	generateUserId();
	$("#eurInputID").val(1);
	populateDropdown();
	getUpdateRate("USD"); //usd is set on page loading, so we need it's rate from the beggining
	log("User connected.")
}

function generateUserId(){
	userId = Date.now()	 // assume it is not possible that 2 users connect at the exact same time
}

function populateDropdown() {
	var currencies = ["AUD","BGN","BRL","CAD","CHF","CNY","CZK","DKK","GBP","HKD","HRK","HUF","IDR","ILS","INR","ISK",
	"JPY","KRW","MYR","MXN","NOK","NZD","PHP","PLN","RON","RUB","SEK","SGD","THB","TRY",/*"USD",*/"ZAR","AED","AFN","ALL",
	"AMD","ARS","AZN","BAM","BDT","BHD","BYN","BOB","CLP","COP","DJF","DZD","EGP","ETB","GEL","GNF","YER","IQD","IRR",
	"JOD","KES","KGS","KWD","KZT","LBP","LYD","LKR","MAD","MDL","MGA","MKD","MNT","MZN","PAB","PEN","PKR","QAR","RSD",
	"SAR","SYP","TJS","TMT","TND","TWD","TZS","UAH","UYU","UZS","VES","VND","XAF","XOF"];
	var x = document.getElementById("currencies");
	var option = document.createElement("option");
	option.text = "USD";
	option.defaultSelected = true;
	x.add(option);
	for (ccr in currencies){
		var option = document.createElement("option");
		option.text = currencies[ccr];
		x.add(option);
	}
}

function convertToForeign(){

	convertToForeignNoLog();
	log("User changed EUR amount to " + $("#eurInputID").val() + " EUR.");
}

function convertToForeignNoLog(){
	if (isRateCorrect){
		var amount = $("#eurInputID").val() * rate;
		$("#foreignInputID").val(amount.toFixed(2));
	}
}

function convertToEur(){
	if (isRateCorrect){
		var amount = $("#foreignInputID").val() * (1 / rate)
		$("#eurInputID").val(amount.toFixed(2));
	}
	log("User changed " + $("#currencies").val() + " amount to " + $("#foreignInputID").val() + "EUR.")
}

async function changeCurencyType(){
	rate = 0;
	isRateCorrect = false;
	log("User changed foreign currency to " + $("#currencies").val() + ".")

	var cType = $("#currencies").val();
	var a = await getUpdateRate(cType)

	if ($("#eurInputID").val() != null)
		convertToForeignNoLog();

	// log($("#currencies").val() + " rate is: " + rate + ".")  
}

// It is not nice to get data and update fieds in the same place, I only wrote this way to simplify async ajax request handling
async function getUpdateRate(currencyCode){
	var url = "http://localhost:8080/getrate/" + currencyCode
	$.ajax({
		url: url,
		dataType: 'text',
		type: "GET",
		mode: 'cors',
  		credentials: 'include',
		success: function(result){
			rate = result;
			isRateCorrect = true;
			convertToForeignNoLog();
			log($("#currencies").val() + " rate is: " + rate.toString() + ".")
			console.log("result: " + result.toString());
		},
		error: function(xhr, status, errorThrown){
			rate = 0;
			isRateCorrect = false;
			$("#foreignInputID").val("");
			console.log("\n error: \n");
			console.log("xhr: " + xhr);
			console.log("Status: " + status);
			console.log("Error: " + errorThrown);
		}
	})
}

// Logging //

function log(action){
	var url = "http://localhost:8080/log"
	var event = {
		userId:	userId,
		date: new Date(),
		action: action
	};
	console.log(event);

	$.ajax({
		url: url,
		"content-type": 'application/json',
		data: event,
		type: "POST",
		mode: 'cors',
  		credentials: 'include',
		success: function(result){
			console.log("result: " + result);
		},
		error: function(xhr, status, errorThrown){
			console.log("\n error: \n");
			console.log("xhr: " + xhr);
			console.log("Status: " + status);
			console.log("Error: " + errorThrown);
		}
	})
}