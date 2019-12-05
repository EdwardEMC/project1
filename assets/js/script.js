$(document).ready(function(){
    var content = $("#inputText").val();

    $.ajax({
    url:"https://www.themealdb.com/api/json/v1/1/search.php?s=brownie", //replace brownie with content once text area working
    METHOD: "GET"
    }).then(function(response){
        console.log(response);
        var ingredients = [];
        var i = 0;
        while(response.meal[0].strIngredient[i]!==null) {
            ingredients.push(response.meals[0].strIngredient+i);
            i++;
        }
        console.log(ingredients);
    })
})