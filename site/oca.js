"use strict";

(function(mycode) {
	mycode(window.jQuery, window, document);
}(function($, window, document) {
	$(function() {

		var currentQuestion = 0;
		var highWaterMark = 0;

		var classQuestion = $(".question");
		var classWho = $(".who");
		var classInput = $("input");

		var hwm = $('#hwm');
		var qNumber = $('#qnumber');
		var divPlus = $("#divPlus");
		var divMid = $("#divMid");
		var divMinus = $("#divMinus");
		var answerButtons = $("#answerButtons");

		var prevNav = $("#prevQuestion");
		var nextNav = $("#nextQuestion");

		function saveAnswer(ans) {
			$("#i" + currentQuestion).val(ans);
		}

		function nextClicked() {
			if (currentQuestion === 0) {
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
			prevQuestion();
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
		}

		function showQuestionDelayed() {
			setTimeout(showQuestion, 200);
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

		classInput.phoenix();

		divPlus.click(plusClicked);
		divMid.click(midClicked);
		divMinus.click(minusClicked);
		prevNav.click(prevClicked);
		nextNav.click(nextClicked);

		getCurrentQuestion();
		showQuestion();
	});
}));
