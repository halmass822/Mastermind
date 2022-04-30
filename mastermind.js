//returns a div containing a grid with each grid tile id as its respective coordinate
//also creates a guessBox object and appends it to the global guessObjects array
    var gridWidth;
    var gridHeight;
    var generatedTiles = [];
    var generatedTileObjects = [];
    var generatedGuessBoxObjects = [];
    function generateGrid(width, height){
        let output = document.createElement('div');
        output.style.border = '2px solid black';
        output.style.margin = '25px auto';
        output.style.display = 'inline-block';
        for( i = 0; i < height; i++ ){
            let row = document.createElement('div');
            row.style.height = '42px';
            for( j = 0; j < width; j++){
                let tileElement = document.createElement('p');
                //grid is created top-down so the id is calculated such that bottom left grid tile is 11, stored as a string
                let generatedId = digitize([j + 1]) + digitize([height - i]);
                tileElement.id = generatedId;
                //created element is added to the generated tiles array then appended to the row
                generatedTiles.push(generatedId);
                tileElement.className = 'gridTile';
                row.appendChild(tileElement);
                const generatedObject = new gridTile(generatedId);
                generatedTileObjects.push(generatedObject);
            }
            output.appendChild(row);
            let buttonElement = document.createElement('button');
            buttonElement.id = `submitButton${digitize(gridHeight - i)}`;
            buttonElement.className = 'submitGuessButton';
            output.appendChild(buttonElement);
            generatedGuessBoxObjects.push(new guessBox(i + 1));
        }
        gridWidth = width;
        gridHeight = height;
        console.log(`Generated ${width} by ${height} grid`);
        return output;
    }

    //returns an array of 4 random colors from the colors array
    function getRandomPegs() {
        const colors = ['blue','green','red','yellow','pink','orange'];
        const getPeg = () => colors[(Math.floor(Math.random() * (colors.length - 0.001)))];
        const output = [getPeg(),getPeg(),getPeg(),getPeg()];
        return output;
    }

    var winningPegs = getRandomPegs();

    class gridTile {
        tileCoordinate;
        tileColor;
        constructor(inputCoordinate){
            if(!/\w{4}$/.test(inputCoordinate)){
                throw "must construct tile class using a string coordinate"
            } else {
                this.tileCoordinate = inputCoordinate;
            }
        }
        changeColor(inputColor){
            this.tileContent = inputColor;
            document.getElementById(this.tileCoordinate).style.backgroundColor = inputColor;
        }
        static getGridtile(inputCoordinate){
            return generatedTileObjects.filter((x) => x.tileCoordinate === inputCoordinate)[0];
        }
    }

    class guessBox {
        guessNumber;
        guesses;
        interactable;
        constructor(inputGuessNumber){
            guessNumber = inputGuessNumber;
            guesses = [,,,,];
            interactable = false;
        }
        reset(){
            this.guesses = [,,,,];
            this.interactable = false;
        }
        checkGuess(inputArray) {
            let blackPegs = 0;
            let whitePegs = 0;
            for(i = 0; i < 4; i++){
                if(winningPegs.includes(this.guesses[i])){
                    if(winningPegs[i] === guess[i]){
                        whitePegs++;
                    } else {
                        blackPegs++;
                    }
                }
            }
            let pegsIncrementor = 0;
            for(i = 0; i < whitePegs; i++){
                targetXCoord = 5 + pegsIncrementor;
                targetYCoord = gridHeight - guessNumber + 1;
                targetCoord = digitize(targetXCoord) + digitize(targetYCoord);
                gridTile.getGridtile(targetCoord).changeColor("#F0F8FF");
                pegsIncrementor++;
            }
            for(i = 0; i < blackPegs; i++){
                targetXCoord = 5 + pegsIncrementor;
                targetYCoord = gridHeight - guessNumber + 1;
                targetCoord = digitize(targetXCoord) + digitize(targetYCoord);
                gridTile.getGridtile(targetCoord).changeColor("black");
                pegsIncrementor++;
            }
        }
        static getGuessBox(inputGuessRow){
            return generatedGuessBoxObjects.filter((x) => x.guessNumber === inputGuessRow)[0];
        }
    }

    function addPeg(coordinate, inputColor){
        const guessRowNumber = gridHeight - Number(coordinate.slice(2,4)) + 1;
        const guessRowObject = guessBox.getGuessBox(guessRowNumber);
        const guessNumberIndex = Number(coordinate.slice(0,2)) - 1;
        if(guessNumber < 5 && guessRowObject.interactable){
            guessRowObject.guesses[guessNumberIndex] = inputColor;
            gridTile.getGridtile(coordinate).changeColor(inputColor);
        }
    }

    function submitGuess(submitButtonId){
        const targetGuessNumber = submitButtonId.slice(12,14);
        const guessBoxObject = guessBox.getGuessBox(targetGuessNumber);
        guessBoxObject.interactable = false;
        guessBoxObject.checkGuess;
    }

    //selectedColor[0] is current selected color, will increment left / right using below function
    var selectedColor = ['blue','green','red','yellow','pink','orange'];
    function incrementSelectedColor(incrementDirection){
        if(incrementDirection === "foward"){
            const firstColor = selectedColor.shift();
            selectedColor.push(firstColor);
            document.getElementById("selectedColorDisplay").style.backgroundColor = selectedColor[0];
        } else if(incrementDirection === "backward"){
            const lastColor = selectedColor.pop();
            selectedColor.unshift(lastColor);
            document.getElementById("selectedColorDisplay").style.backgroundColor = selectedColor[0];
        } else {
            throw `incrementSelectedColor error, invalid input ${incrementDirection}`;
        }
    }

    function userInteraction(event){
        const targetElement = event.target;
        if(event.target.className === "gridTile"){
            addPeg(event.id,selectedColor);
        } else if(event.target.className === "submitGuessButton"){
            submitGuess(targetElement.id);
        }
    }

    function startGame() {
        generatedGuessBoxObjects.forEach((x) => x.reset());
        generatedTileObjects.forEach((x) => x.changeColor("white"));
        guessBox.getGuessBox(1).interactable = true;
    }