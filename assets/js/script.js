$(document).ready(function(){
    var recipeArea = $("#recipe");
    var recipeTitle = $("#recipeTitle");
    var y;

    //Checks local storage and sets y to either 0 or the id of the previous button
    checkStorage();

    $("#searchBtn").on("click", function(){
        var content = $("#inputText").val();
        clearAll();
        request(content);
    });   

    $(".addButtons").on("click", function(event){
        event.preventDefault();
        //emptying the fields
        clearAll();
        var content = event.target.value;
        request(content);
    });
    
    function request(content){
        $.ajax({
        url:"https://www.themealdb.com/api/json/v1/1/search.php?s="+content,
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
        });

        var button = $("<button>").text(content);
        button.val(content);
        button.text(content);
        button.attr("id", y);
        button.addClass("btn btn-info");
        $(".addButtons").append(button);
        y+=1;
        localStorage.setItem("tracker", y);
    }

    //function to clear divs after each search
    function clearAll(){
        recipeArea.empty();
        recipeTitle.empty();
    }

    //function to check local storage
    function checkStorage() {
        if(localStorage.getItem("tracker")===null) {
            y = 0;
        }
        else {
            y = localStorage.getItem("tracker");
        }
    }

    //function to display name to the title
    function recipeName(response) {
        recipeTitle.text(response.meals[0].strMeal);
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
        var instructions = $("<h3>").text("Instructions");
        var method = $("<p>").text(response.meals[0].strInstructions);

        recipeArea.append(instructions, method);
    }
})