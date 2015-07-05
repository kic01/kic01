"use strict";

(function(mycode) {
	mycode(window.jQuery, window, document);
}
		(function($, window, document) {
			$(function() {

				var elemBody = $("body");

				if (typeof (Storage) === "undefined") {
					elemBody
							.html(""
									+ "<p><p>Sorry, this site requires that your browser supports HTML5-localStorage."
									+ "<p>Please make sure that your browser is updated to a current version.");
					return;
				}

				var storage = window.localStorage;

				var currentQuestion = 0;
				var highWaterMark = 0;

				var classQuestion = $(".question");
				var classWho = $(".who");
				var classInput = $(".pAnswer");

				var hwm = $("#hwm");
				var qNumber = $("#qnumber");
				var divPlus = $("#divPlus");
				var divMid = $("#divMid");
				var divMinus = $("#divMinus");
				var answerButtons = $("#answerButtons");

				var prevNav = $("#prevQuestion");
				var nextNav = $("#nextQuestion");

				var fFornamn = $("#fornamn");
				var fEfternamn = $("#efternamn");
				var fGatuadr = $("#gatuadr");
				var fPostnr = $("#postnr");
				var fPostort = $("#postort");
				var fTelefon = $("#telefon");
				var fEpost = $("#epost");
				var fAlder = $("#alder");
				var fKon = $("#kon");

				function saveAnswer(ans) {
					var a = $("#i" + currentQuestion);
					a.val(ans);
					saveField(a);
				}

				function nextClicked() {
					if (currentQuestion === 0) {
						saveContactData();
						currentQuestion = highWaterMark;
						showQuestionDelayed();
					} else if (currentQuestion < highWaterMark) {
						nextQuestion();
						showQuestionDelayed();
					}
				}

				function prevClicked() {
					prevQuestion();
					showQuestionDelayed();
				}

				function plusClicked() {
					divPlus.css("border", "3px solid #444444");
					saveAnswer("+");
					nextQuestion();
					showQuestionDelayed();
				}

				function midClicked() {
					divMid.css("border", "3px solid #444444");
					saveAnswer("M");
					nextQuestion();
					showQuestionDelayed();
				}

				function minusClicked() {
					saveAnswer("-");
					divMinus.css("border", "3px solid #444444");
					nextQuestion();
					showQuestionDelayed();
				}

				function nextQuestion() {
					if (currentQuestion <= 200) {
						currentQuestion += 1;
					}
				}

				function prevQuestion() {
					if (currentQuestion >= 1) {
						currentQuestion -= 1;
					}
				}

				function cssAnswerButtons() {
					var cssPlus = "3px solid #CCCCCC";
					var cssMid = "3px solid #CCCCCC";
					var cssMinus = "3px solid #CCCCCC";
					var ans = $("#i" + currentQuestion).val();
					if (ans === "+") {
						cssPlus = "3px solid #444444";
					} else if (ans === "M") {
						cssMid = "3px solid #444444";
					} else if (ans === "-") {
						cssMinus = "3px solid #444444";
					}
					divPlus.css("border", cssPlus);
					divMid.css("border", cssMid);
					divMinus.css("border", cssMinus);
				}

				function showQuestion() {
					classQuestion.hide();
					if (currentQuestion === 0) {
						classWho.show();
						answerButtons.hide();
						prevNav.hide();
						nextNav.show();
					} else {
						classWho.hide();
						cssAnswerButtons();
						answerButtons.show();
						prevNav.show();
						$("#q" + currentQuestion).show();
						if (currentQuestion < highWaterMark) {
							nextNav.show();
						} else {
							nextNav.hide();
						}
					}
					qNumber.val("" + currentQuestion);
					if (currentQuestion > highWaterMark) {
						highWaterMark = currentQuestion;
						hwm.val("" + highWaterMark);
					}
					saveField($(hwm));
					saveField($(qnumber));
				}

				function showQuestionDelayed() {
					setTimeout(showQuestion, 50);
				}

				function getCurrentQuestion() {
					var s = "" + (qNumber.val());
					if (s === "") {
						s = "0";
					}
					currentQuestion = parseInt(s);
					var s = "" + (hwm.val());
					if (s === "") {
						s = "1";
					}
					highWaterMark = parseInt(s);
					hwm.val("" + highWaterMark);
					return currentQuestion;
				}

				function itemKey(field) {
					return 'key.' + field.attr('id');
				}

				function loadField(field) {
					var v = storage.getItem(itemKey(field));
					if (v === null || v === "null") {
						field.val(null);
					} else {
						field.val(v);
					}
				}

				function saveField(field) {
					var v = field.val();
					if (v === null || v === "null") {
						v = "";
					}
					storage.setItem(itemKey(field), v);
				}

				function loadData() {
					loadField(fFornamn);
					loadField(fEfternamn);
					loadField(fGatuadr);
					loadField(fPostnr);
					loadField(fPostort);
					loadField(fTelefon);
					loadField(fEpost);
					loadField(fAlder);
					loadField(fKon);
					loadField($(hwm));
					loadField($(qnumber));
					var questions = $(".pAnswer");
					for (var i = 0; i < questions.size(); i++) {
						loadField($(questions.get(i)));
					}
				}

				function saveContactData() {
					saveField(fFornamn);
					saveField(fEfternamn);
					saveField(fGatuadr);
					saveField(fPostnr);
					saveField(fPostort);
					saveField(fTelefon);
					saveField(fEpost);
					saveField(fAlder);
					saveField(fKon);
				}

				function showData() {
					var result = "";
					for ( var key in storage) {
						var v = storage.getItem(key);
						if (v !== null) {
							result += key + " => " + v + "\n";
						}
					}
					alert(result);
				}

				// showData();

				// storage.clear();

				loadData();
				// $('.pLocal').hide();
				// $('.pAnswer').hide();

				// classInput.phoenix();

				divPlus.click(plusClicked);
				divMid.click(midClicked);
				divMinus.click(minusClicked);
				prevNav.click(prevClicked);
				nextNav.click(nextClicked);

				getCurrentQuestion();
				showQuestion();
			});
		}));
