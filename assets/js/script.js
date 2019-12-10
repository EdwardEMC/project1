$(document).ready(function(){
    var recipeArea = $("#recipe");
    var recipeTitle = $("#recipeTitle");
    var y;

    checkStorage(); //Checks local storage and sets y to either 0 or the id of the previous button

    //on click on the search input to search for an ingredient
    $("#searchBtn").on("click", function(){
        var content = $("#inputText").val();
        clearAll(); //emptying the fields
        var queryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i="+content;
        request(content, queryURL);
    });   

    //on click to search the saved search buttons
    $(".addButtons").on("click", function(event){
        event.preventDefault();
        var content = event.target.value;
        var queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s="+content;
        clearAll();
        request(content, queryURL);
    });

    //on click to search one of the recipes added
    recipeArea.on("click", function(event){
        event.preventDefault();
        var content = event.target.value;
        var queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s="+content;
        request(content, queryURL);
        clearAll();
    });
    
    //function containing the ajax request
    function request(content, queryURL){
        $.ajax({
        url: queryURL,
        METHOD: "GET"
        }).then(function(response){
            console.log(response);
            var i = 0; //reset the counter for every request

            if(queryURL=="https://www.themealdb.com/api/json/v1/1/filter.php?i="+content) {
                var meals = [];
                while(i<response.meals.length) {
                    meals.push(response.meals[i].strMeal);
                    i++; 
                }
                for(x=0; x<meals.length; x++) {
                    var button = $("<button>").text(meals[x]);
                    button.val(meals[x]);
                    button.attr("id", y);
                    button.addClass("btn btn-info"); //change to bulma css---------------------------------------------------------------------
                    recipeArea.append(button);
                }
            }
            else {
                displayRecipe(response, content);
            }   
        }).fail(function() { //Adding a function if the ajax request fails
            recipeArea.text("There is no recipe available with that name.");
            return;
        });
    }

    //function to display recipe
    function displayRecipe(response, content) {   
        var ingredients = [];
        var i = 1;
        while(response.meals[0]["strIngredient"+i]!=="") {
            ingredients.push(response.meals[0]["strIngredient"+i]);
            i++;
        }
        buttonCreate(content);
        recipeName(response);
        ingrList(ingredients);
        method(response);
    }

    //function to create the buttons
    function buttonCreate(content) {
        var alreadyButtons = [];
        for(x=0; x<y; x++) {
            alreadyButtons.push(localStorage.getItem(x));
        }
        //if condition to check if the button is already there
        if(!alreadyButtons.includes(content)) {
            var button = $("<button>").text(content);
            button.val(content);
            button.attr("id", y);
            button.addClass("btn btn-info"); //change to bulma css---------------------------------------------------------------------
            $(".addButtons").append(button);
            localStorage.setItem(y, content); //saving the recipe searched to local storage
            y = y + 1;
            localStorage.setItem("tracker", y); 
        }
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
            y = parseInt(localStorage.getItem("tracker"));
        }

        for(i=0; i<y; i++) {
            var button = $("<button>").text(localStorage.getItem(i));
            button.val(localStorage.getItem(i));
            $(".addButtons").append(button);
        }
    }

    //function to display name to the title
    function recipeName(response) {
        var name = $("<h3>").text(response.meals[0].strMeal);
        recipeTitle.append(name);
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