var bulbSection =
  "<p> <i class='fas fa-lightbulb' style='color:#7386d5;'></i>. Shih përgjigjen </p>";
var pageContent = $("#book-content");
var contentString = "";

$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

function createInfoJumbotron(info) {
  var jumbotron =
    "<div class='jumbotron' id='shenim'>" +
    "<h1 class='display-4'>Shënim</h1>" +
    "<hr class='my-4'>" +
    "<p>" +
    info.Shenim1 +
    "</p>" +
    "<div class='card text-white bg-danger mb-3'>" +
    "<div class='card-body'>" +
    "<p class='card-text'>" +
    info.Shenim2 +
    "</p>" +
    "</div>" +
    "</div>" +
    "<hr class='my-4'>" +
    "<p>" +
    info.Shenim3 +
    "</p>" +
    "<hr class='my-4'>" +
    "<p>" +
    info.Shenim4 +
    "</p>";
  +"</div>";

  return jumbotron;
}

// Leximi i permbajtjes dhe ndertimi i pyetjeve
function createContentAsync() {
  return Promise.resolve().then(v => {
    createContent();
  });
}

function createQuestionDiv(question) {
  var questionNumber = question.Nr;
  var rating = question.Vleresimi;
  var questionText = question.Pyetja;
  var responseText = question.Pergjigja;
  var imagePath = question.VendodhjaImazhit;
  var questionId = "answer-" + questionNumber;
  var captionRegex = /figura-\d+/gm;
  var tableClass = "";
  var badgeClass = "";
  var imageDiv = "";

  if (questionNumber == 262) {
    var responseTable = createTableResponse(
      JSON.parse(responseText).Pergjigja262
    );
    responseText = responseTable.outerHTML;
    tableClass = "table-responsive-sm";
  } else {
    tableClass = "";
  }

  switch (rating) {
    case 1:
      badgeClass = "badge badge-success";
      break;
    case 2:
      badgeClass = "badge badge-warning";
      break;
    case 3:
      badgeClass = "badge badge-danger";
      break;
  }

  if (imagePath != null && imagePath.length > 0) {
    var figureCaption = imagePath.match(captionRegex);

    imageDiv =
      "<div>" +
      "<figure>" +
      "<img src='" +
      imagePath +
      "' class='img-fluid' alt='' width='400' height='500' />" +
      "<figcaption><i> " +
      figureCaption[0] +
      "</i></figcaption>" +
      "</figure>" +
      "</div>" +
      "<br />";
  } else {
    imageDiv = "";
  }

  var questionContent =
    "<p class='question'> " +
    "<span class='" +
    badgeClass +
    "'> " +
    "<b>" +
    questionNumber +
    "</b>. " +
    "</span> " +
    questionText +
    "</p>" +
    imageDiv;

  var refElementContent =
    "<a href='#" +
    questionId +
    "' aria-controls='" +
    questionId +
    "' data-toggle='collapse' aria-expanded='false'>" +
    bulbSection +
    "</a>";

  var fooDiv =
    "<div id='" +
    questionId +
    "' class='collapse'>" +
    "<div class='card card-body " +
    tableClass +
    "'>" +
    "<i>" +
    responseText +
    "</i>" +
    "</div>" +
    "</div>" +
    "<br />";

  var questionDiv =
    "<div>" + questionContent + refElementContent + fooDiv + "</div>";

  //contentString += questionDiv;
  return questionDiv;
}

function createTableResponse(jsonResponse) {
  // Extract value for html header.
  var header = [];
  for (var i = 0; i < jsonResponse.length; i++) {
    for (var key in jsonResponse[i]) {
      if (header.indexOf(key) === -1) header.push(key);
    }
  }

  // Create dynamic table
  var table = document.createElement("table");
  table.setAttribute("class", "table");
  // Adding the header rows to created table
  var tr = table.insertRow(-1);

  for (var i = 0; i < header.length; i++) {
    var th = document.createElement("th");
    th.innerHTML = header[i];
    tr.appendChild(th);
  }

  // Add json data as table rows
  for (var i = 0; i < jsonResponse.length; i++) {
    tr = table.insertRow(-1);

    for (var j = 0; j < header.length; j++) {
      var tableCell = tr.insertCell(-1);
      tableCell.innerHTML = jsonResponse[i][header[j]];
    }
  }

  return table;
}

function createContent() {
  $.getJSON("./data/320-pyetje-mbi-gjeografine.json", function(content) {
    $(createInfoJumbotron(content.Shenime)).insertBefore(pageContent);

    contentString =
      "<div id='parathenie' class='card mb-3'>" +
      "<div class='row no-gutters'>" +
      "<div class='col-md-4'>" +
      "<center class='book-cover'><img src='./resources/images/libri.jpg' class='img-fluid center-block' width='600' height='800'></center>" +
      "</div>" +
      "<div class='col-md-8'>" +
      "<div class='card-body'>" +
      "<h5 class='card-title'> <span class='badge badge-danger'><b>Parathënie </b></span></h5>" +
      "<p class='card-text'>" +
      content.Parathenie +
      "</p>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "<br />" +
      "</br>";

    var sidebarContent = "";
    var partId = 1;
    content.Permbajtja.forEach(element => {
      var sideBarMenuLink =
        "<li>" +
        "<a href='#pjesa" +
        partId +
        "' class='dropdown-toggle list-group-item list-group-item-action bg-light' data-toggle='collapse' aria-expanded='false'>" +
        element.Pjesa +
        "</a>" +
        "<ul class='collapse list-unstyled' id='pjesa" +
        partId +
        "'>";

      partId++;

      element.Kapitujt.forEach(chapter => {
        var chapterDiv =
          "<div id='chapter-" +
          partId +
          "-" +
          chapter.NrKapitulli +
          "' class='border border-success rounded'>" +
          "<h5 class='card-title'>" +
          chapter.Kapitulli +
          "</h5>" +
          "<hr />";

        sideBarMenuLink +=
          "<li>" +
          "<a href='#chapter-" +
          partId +
          "-" +
          chapter.NrKapitulli +
          "'>" +
          chapter.Kapitulli +
          "</a>";
        +"</li>";

        chapter.Pyetjet.forEach(question => {
          chapterDiv += createQuestionDiv(question);
        });

        chapterDiv += "</div>" + "<br/>";
        contentString += chapterDiv;
      });

      sideBarMenuLink += "</ul>";
      sideBarMenuLink += "</li>";

      sidebarContent += sideBarMenuLink;
    });

    $(".sidebar-content").append(sidebarContent);
    pageContent.append(contentString);
  });
}

$(window).on("load", function() {
  var loadingDiv = $("#loading-modal");

  loadingDiv.show();
  setTimeout(async () => {
    await createContentAsync();
    loadingDiv.hide();
  }, 5000);
});
