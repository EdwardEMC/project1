$(document).ready(function(){
    var recipeArea = $("#recipe");
    var recipeTitle = $("#recipeTitle");
    var y;

    //Checks local storage and sets y to either 0 or the id of the previous button
    checkStorage();

    $("#searchBtn").on("click", function(){
        var content = $("#inputText").val();
        clearAll(); //emptying the fields
        request(content);
        buttonCreate(content);
    });   

    $(".addButtons").on("click", function(event){
        event.preventDefault();
        var content = event.target.value;
        clearAll();
        request(content);
    });
    
    function request(content){
        $.ajax({
        url:"https://www.themealdb.com/api/json/v1/1/search.php?s="+content,
        METHOD: "GET"
        }).then(function(response){
            console.log(response);
            var ingredients = [];
            var i = 1;
            while(response.meals[0]["strIngredient"+i]!=="") {
                ingredients.push(response.meals[0]["strIngredient"+i]);
                i++;
            }
            
            recipeName(response);
            ingrList(ingredients);
            method(response);
        });
    }

    //function to create the buttons
    function buttonCreate(content) {
        var button = $("<button>").text(content);
        button.val(content);
        button.text(content);
        button.attr("id", y);
        button.addClass("btn btn-info");
        $(".addButtons").append(button);
        localStorage.setItem(y, content); //saving the recipe searched to local storage
        y = y + 1;
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