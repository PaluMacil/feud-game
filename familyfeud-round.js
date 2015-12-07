var ifr;
var sum;
var strikeCount;
var menu_html = "";
var currentQuestionText = "Example question text.";

$(document).ready(function () {
    ifr = document.getElementById('sound');
    sum = 0;
    strikeCount = 0;

    showMainMenu();

    setUpBuzzers();

    $("#random").click(function () {
        newQuestionResets();
        setRandomNumber();
        loadQuestion();
        setUpAnswers();
    });

    $("#goto").click(function () {
        newQuestionResets();
        loadQuestion();
        setUpAnswers();
    });

    $(window).keypress(function (e) {
        handleKeys(e.which);
    });
});

function handleKeys(key) {
    if (key == 65 || key == 97) { //a or A
        //Show or hide the question for this set of *A*nswers.
        //(if main menu not open and if question is not open)
        if ($('#main-menu').hasClass("gamemode")) {
            if ($('#overlay').length == 0) {
                showCurrentQuestion();
            } else {
                hideCurrentQuestion();
            }
        }
    }
    if (key == 81 || key == 113) { //q or Q
        //Show or hide ALL *Q*uestions (Main Menu).
        if ($('#main-menu').hasClass("gamemode")) {
            showMainMenu();
        } else {
            hideMainMenu();
        }
    }
    if (key == 82 || key == 114) { //r or R
        //get *r*andom question.
        $('#random').trigger('click');
    }
    if (key == 83 || key == 115) { //s or S
        //*S*trike! (unless main menu open)
        if ($('#main-menu').hasClass("gamemode")) {
            $('#strike').trigger('click');
        }
    }
    if (key == 13) { //'enter' key
        //Go to question in the text input or close current question.
        if ($('#main-menu').hasClass("gamemode")) {
            $('#goto').trigger('click');
        }
    }
    if (key == 72 || key == 104) { //h or H
        //Show/hide *h*elp.
        if ($('#help').is(':visible')) {
            $('#help').hide();
        }
        else {
            $('#help').show();
        }
    }
}

function hideMainMenu() {

	$('#main-menu').addClass("gamemode");
    $('#main-menu-header').addClass("gamemode");
}

function showMainMenu() {
    if (menu_html == "") {
        $.ajax({
            async: true, //I just won't display the menu till it loads
            url: "menu.html",
            dataType: "html",
            success: function (data) {
                menu_html = data;
                $('#main-menu').html(menu_html);
				$('#main-menu-header').removeClass("gamemode");
                $('#main-menu').removeClass("gamemode");
            }
        });
    } else {
        $('#main-menu').html(menu_html);
        $('#main-menu').removeClass("gamemode");
        $('#main-menu-header').removeClass("gamemode");
    }
}

function setQuestionFromMainMenu(selected_id) {
    $("#qnum").val(selected_id.substring(1));
    $("#goto").trigger("click");
    hideMainMenu();
}

function newQuestionResets() {
    sum = 0;
    sumScores(0);
    strikeCount = 0;
    $("#strike-count").text("0")
    $("span").remove(".wrongx");
	hideMainMenu();
}

function loadQuestion() {
    var json_url = $("#qnum").val() + ".json";
    var json_data;
    $.ajax({
        async: false, //must be blocking to ensure immediate availability of data afterwards
        url: json_url,
        dataType: "json",
        success: function (data) {
            json_data = data;
        }
    });

    currentQuestionText = json_data.question_text;
    showCurrentQuestion();
    var ans_count = Object.keys(json_data.answers).length;
    deactivate_unused_boxes(ans_count + 1);
    $.each(json_data.answers, function (i, item) {
        add_answer(i, item);
    });
}

function showCurrentQuestion() {
    if($('#overlay').length == 0) {
        $("body").append("<div id='overlay' class='overlay'>" + currentQuestionText + " (<a id='hideCurrentQuestion' href='#'>close</a>)</div>");

        $('#overlay').click(function () {
            hideCurrentQuestion();
        });
    }
}

function hideCurrentQuestion() {
    //$("#overlay").hide("slow", function () {
    $("#overlay").hide();
    $("#overlay").remove(); //Remove is more expensive and should be done after hide.
    //});
}

function add_answer(i, item) {
    var active_box_html =
    '<section class="container active" id="answer' + i + '" data-score="' + item.answer_points + '">\n' +
      '<div class="answer">\n' +
	    '<figure class="front"><span>' + i + '</span></figure>\n' +
	    '<figure class="back">' + item.answer_text + '<span class="score">' + item.answer_points + '</span></figure>\n' +
      '</div>\n' +
    '</section>\n';
    $("#answer" + i.toString()).replaceWith(active_box_html);
}

function deactivate_unused_boxes(start) {
    //I need this or questions with fewer answers will not overwrite all the previous answers.
    for (i = start; i < 11; i++) {
        var inactive_box_html =
        '<section class="container" id="answer' + i + '">\n' +
          '<div class="inactive"></div>\n' +
        '</section>\n';
        $("#answer" + i.toString()).replaceWith(inactive_box_html);
    }
}

function playBell() {
  ifr.src = 'ff-clang.wav';
}

function playBuzzer() {
  ifr.src = 'buzzer.mp3';
}

function setUpAnswers() {
  $('#rotating-answers').find('.active').on('click', 
      function() {
        var answer = $(this).find('.answer');
        if (!answer.hasClass('flipped')) {
          answer.addClass('flipped');
          playBell();
          sumScores($(this).data("score"));
        }
      });
}

function setUpBuzzers() {
  $('#strike').on('click', 
      function() {
        if (strikeCount < 3){  
          strikeCount++;
          $('#strike-count').text(strikeCount);
          var strike = $('<span class="wrongx">X</span>')
          var wrong = $('#wrong');
          wrong.append(strike);
          playBuzzer();
          wrong.fadeIn('fast');
          setTimeout(function() {wrong.fadeOut('fast');}, 1500);
        }
      });
}

function setRandomNumber() {
    var rnd = Math.floor(Math.random() * 1065);
    $("input").val(rnd.toString());
}

function sumScores(score) {
    sum += score;
  $('#score').text(sum);
}
