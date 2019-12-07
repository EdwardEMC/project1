var content = $("#inputText").val();
var APIKey = "14518866-15b065df23eaa04c7d4ef76d0";

$.ajax({
    url: "https://pixabay.com/api/?key="+APIKey+"&q="+content+"&image_type=photo",
    method: "GET"
})

.then(function(response){

    console.log(response);

    var results = response.hits[0].largeImageURL;

    var imgFood = $("<img>");

    imgFood.attr("src", results);

    console.log(results);

    // appending the img div 

    $("#foodPic").append(imgFood);
})



