    //returns an array of 4 random colors from the colors array
    function getRandomPegs() {
        const colors = ['blue','green','red','yellow','pink','orange'];
        const getPeg = () => colors[(Math.floor(Math.random() * (colors.length - 0.001)))];
        const output = [getPeg(),getPeg(),getPeg(),getPeg()];
        return output;
    }

    var winningPegs = getRandomPegs();

    //returns an array of all the related elements to that guessNumber - index 0 - 3 are the guesses, 4-7 are the responses
    function getElements(guessNumber) {
        let outputArray = [];
        const guessIds = [];
        const responseIds = [];
        //gets all the element ids and pushes them to the respective array
        for(i = 1; i < 5; i++) {
            guessIds.push(`guess${guessNumber}${i}`);
            responseIds.push(`response${guessNumber}${i}`);
        }
        //gets the elements from the arrays and pushes them to the output array
        guessIds.forEach((x) => {
            outputArray.push(document.getElementById(x));
        })
        responseIds.forEach((x) => {
            outputArray.push(document.getElementById(x));
        })
        return outputArray;
    }

    class guessBox {
        guessNumber;
        guesses;
        interactable;
        constructor(inputGuessNumber){
            this.guessNumberguessNumber = inputGuessNumber;
            this.guesses = [,,,,];
            this.interactable = false;
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

document.getElementById("gridContainer").appendChild(generateGrid(4,10));