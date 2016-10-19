var Clarifai = require('clarifai');
var app = new Clarifai.App(
  'LzXEFU2gsfodIIjTO5YqNVqUvFRmJUkFYrep89bb',
  'VgVrrKfTFrFFVDTFVqD0EwDdHnqtku-q6IAcb1KD'
);
  var API_KEY = '3508192-a3f9ba87aae26460abf2d2130';

function updateModel(model) {
  model.deleteConcepts({"id": "no person"}).then(
    function(response) {
      // do something with response
    },
    function(err) {
      // there was an error
    }
  );
}
var winners = [];
// app.models.initModel('aaa03c23b3724a16a56b629203edc62c').then(function(model) {
//   updateModel,
//   function(err) {
//     // there was an error
//   }
// });
var stuff = "stuff";
$(function(){

  var destination = "";
  var score = 0;
  var clicks = 0;
  var countDown = 120;
  var displayTimer;

  var updateScores = function(){
    $(".scoresList").empty();
    // winners.sort(keysrt('score'));
    winners.forEach(function(score){
      $('.scoresList').append("<li>"+score.name + " " + score.score+"</li>");
    });
};

  var displayClicks = function(){
    clicks +=1;
    $("#clicks").text(clicks);
    if(clicks === 15){
      gameOver();
    }
};

    var gameOver = function(){
        setTimeout(function(){
          alert("game over");
        }, 500);
        clicks = 0;
        countDown = 120;
        clearInterval(displayTimer);
        $('.startButton').toggle();
        $("img").off();
    };

  ////timer functions
  var updateTimer = function(){
    if(countDown === 0){
      clearInterval(displayTimer);
    }
    else{
      countDown -= 1;
      $("#timer").text(countDown + " seconds");
    }
  };
  var start = function(){
    displayTimer = setInterval(updateTimer, 1000);
    $(".pathBox").empty();
    $(".resultImages").empty();

  };

var playerWins = function(url, tag){
$(".winBox").css("background-image", "url("+ url +")");
  score = (15-clicks)* countDown + 100;
  setTimeout(function(){
      var playerName = prompt("You Win! Enter your name:");
  }, 500);
  var playerResult = {"score":score, "name":playerName};
  winners.push(playerResult);
  $("img").off();
  $('.startButton').toggle();
  //add player name in future
};


var startingWords = ["rodent", "nature", "bird", "beach", "pizza", "tree", "boat", "waterfall", "flower", "sunset", "hamburger", "car", "beautiful", "hillary", "leader", "snail", "math", "mesh", "soccer", "crowd", "proud", "happy", "egg", "russia"];

  $(".startButton").click(function(){
    start();
    $('.startButton').toggle();
    $(".winBox").css("background-image", "url('')");
    var random1 = Math.floor(Math.random() * (startingWords.length ));
    var random2 = Math.floor(Math.random() * (startingWords.length));
    var startTag = startingWords[random1];
    while(random1 === random2){
      random2 = Math.floor(Math.random() * (startingWords.length));
    }
    var endTag = startingWords[random2];
    destination = endTag;
    console.log(random1 +" "+ random2 + startTag + endTag);
    $(".endTag").text('->'+ endTag);

    var URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(startTag);
    $.getJSON(URL, function(data){
      var testVar = data.hits[0].webformatURL;
      console.log(testVar);
      $(".imgBox").css("background-image", "url("+ testVar +")");
      getTags(testVar);
    });

  });
  var getTags = function(url, bigUrl){
    displayClicks();
    app.models.predict(Clarifai.GENERAL_MODEL, url).then(
      function(response) {
        console.log(response);
        var tag1 = response.data.outputs[0].data.concepts[0].name;
        var tag2 = response.data.outputs[0].data.concepts[1].name;
        var tag3 = response.data.outputs[0].data.concepts[2].name;
        var tag4 = response.data.outputs[0].data.concepts[3].name;
        var tag5 = response.data.outputs[0].data.concepts[4].name;
        var tags = [tag1,tag2,tag3,tag4,tag5];
        $("#tag1").text(tag1);
        $("#tag2").text(tag2);
        $("#tag3").text(tag3);
        $("#tag4").text(tag4);
        $("#tag5").text(tag5);
        var tagsToString = tag1 + " " + tag2 + " "+tag3;
        var tagsToString2 = tagsToString.replace(/no person|invertebrate|desktop|epicure|shelf|vector|illustration/gi, "");
        // other tags to remove
        // invertebrate, desktop, epicure,
          if (tags.includes(destination)){
            playerWins(bigUrl, destination);
            updateScores();
          } else {
            likeImages(tagsToString2);
          }
      },
      function(err) {
        console.error(err);
      }
    );
  };

  var likeImages = function(imgTag){
    var URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(imgTag);
    $.getJSON(URL, function(data){
      if (parseInt(data.totalHits) > 0){
        $.each(data.hits, function(i, hit){
          console.log(hit);
          $(".resultImages").append("<img class='resultImage' src='"+hit.previewURL+"'>");
          var scrollDown = function(){
            $("div.resultImages").scrollTop(90000);
          };
          var scrollTimer = setTimeout(scrollDown, 1000);
          $("img").last().click(function(){
            var url = $(this).attr("src");
            var bigUrl = hit.webformatURL;
            $(".pathBox").append("<img  src='"+url+"'>");
            console.log(bigUrl);
            getTags(url, bigUrl);
            $(this).addClass('clicked');
          });
        });
      } else {
        console.log('No hits');
      }
    });
  };
});
