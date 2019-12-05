$(document).ready(function(){
    var recipeArea = $("#recipe");
    var content = $("#inputText").val();

    $("#searchBtn").on("click", function(){
        $.ajax({
        url:"https://www.themealdb.com/api/json/v1/1/search.php?s="+content, //replace brownie with content once text area working
        METHOD: "GET"
        }).then(function(response){
            console.log(response);
            var ingredients = [];
            var i = 0;
            while(response.meals[0]["strIngredient"+i]!=="") {
                ingredients.push(response.meals[0]["strIngredient"+i]);
                i++;
            }
            
            recipeName(response);
            ingrList(ingredients);
            method(response);
        })

        var button = $("<button>").text(content);
        button.val(content);
        button.attr("id", y);
        button.addClass("btn btn-info");
        $(".addButtons").append(button);
    })    


    //function to display name to the title
    function recipeName(response) {
        $("#recipeTitle").text(response.meals[0].strMeal);
    }

    //function to create ingredient list
    function ingrList(ingredients) {
        var ingredientList = $("<ul>");
        for(i=0; i<ingredients.length; i++) {
            var ingredient = $("<li>").text(ingredients[i]);
            ingredientList.append(ingredient);
        }
        recipeArea.append(ingredientList);
    }

    //function to attach the method and links
    function method(response) {
        var instructions = $("<h3>").text("instructions");
        var method = $("<p>").text(response.meals[0].strInstructions);

        recipeArea.append(instructions);
        recipeArea.append(method);
    }
})