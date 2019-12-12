$(document).ready(function(){
    var recipeArea = $("#recipe");
    var recipeTitle = $("#recipeTitle");
    var APIKey = "c57cb70d4a7c402fa9d244be4b570632";
    var y;
    var offset = offsetNum();

    checkStorage(); //Checks local storage and sets y to either 0 or the id of the previous button

    //on click on the search input to search for an ingredient
    $("#searchBtn").on("click", function(){
        event.preventDefault();
        var content = $("#inputText").val();
        clearAll(); //emptying the fields
        var queryURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey="+APIKey+"&ingredients="+content+"&number=90";
        request(content, queryURL);
    });   

    //on click event so enter can be used as a search function as well as click
    $("#inputText").keypress(function(e) {
        if(e.which == 13) {
            $("#searchBtn").click();
        }
    });

    //on click to search the saved search buttons
    $(".addButtons").on("click", function(event){
        event.preventDefault();
        var content = event.target.value;
        if(content!==undefined) { //detects if clicking a button vs clicking blank space
            var queryURL = "https://api.spoonacular.com/recipes/"+content+"/information?apiKey="+APIKey;
            clearAll();
            request(content, queryURL);
        }
    });

    //on click to search one of the recipes added
    recipeArea.on("click", function(event){
        event.preventDefault();
        recipe = event.target.innerText;
        var content = event.target.value;
        var queryURL = "https://api.spoonacular.com/recipes/"+content+"/information?apiKey="+APIKey;
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

            if(queryURL=="https://api.spoonacular.com/recipes/findByIngredients?apiKey="+APIKey+"&ingredients="+content+"&number=90") {
                var meals = [];
                var i = offset;
                
                while(i<offset+10) { //get only 10 results from the offset value
                    meals.push(response[i].title);
                    i++; 
                }
                for(x=offset, z=0; x<(offset+meals.length); x++, z++) {
                    var button = $("<button>").text(meals[z]);
                    button.val(response[x].id);
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
        for(x=0; x<response.extendedIngredients.length; x++) {
            ingredients.push(response.extendedIngredients[x].name);
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
            var loadBtn = JSON.parse(localStorage.getItem(x))
            alreadyButtons.push(loadBtn.id);
        }
        //if condition to check if the button is already there
        if(!alreadyButtons.includes(content)) {
            var saveBtn = {"id":content,"text":recipe};
            var button = $("<button>").text(recipe);
            button.val(content);
            button.attr("id", y);
            button.addClass("btn btn-info"); //change to bulma css---------------------------------------------------------------------
            $(".addButtons").append(button);
            localStorage.setItem(y, JSON.stringify(saveBtn)); //saving the recipe searched to local storage
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
            var loadBtn = JSON.parse(localStorage.getItem(i))
            var button = $("<button>").text(loadBtn.text);
            button.val(loadBtn.id);
            $(".addButtons").append(button);
        }
    }

    //function to display name to the title
    function recipeName(response) {
        var name = $("<h3>").text(response.title); 
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
        var method = $("<ul>").text(response.instructions);
        recipeArea.append(instructions, method);
    }

    //function to create randmised offset, so different recipes show up
    function offsetNum() {
        return Math.floor(Math.random()*80);
    }
})