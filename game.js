let imageRequest = new XMLHttpRequest();
let listRequest = new XMLHttpRequest();


let currentWord = null;
let currentImage = null;
let strikes = 0;

let currentWordList = [];
let guessedLetters = [];


const listAPI = "https://dog.ceo/api/breeds/list/all";
const imageAPI = "https://dog.ceo/api/breed/CHANGE/images/random";

const letterList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
"q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];




//After button is pressed play game


startGame();





function gamePlay()
{
  //render image
  var html = '<img src="' + JSON.parse(this.response).message + '">';
  currentWordList= Array(currentWord.length).fill("_");
  //render word
  console.log(currentWord);


  //get input
  document.onkeyup = function(event) {

    //first check if user has already put in input make sound if he has also make sure inputs a letter
    if(guessedLetters.indexOf(event.key) === -1)
    {
        //if wrong render strikes
        //if strikes === 4 render lose screen
        //reset
      if(currentWord.indexOf(event.key) !== -1)
      {
        //find all occurences in word and fill them in
        for(var i = 0; i < currentWord.length; i++)
        {
          if(currentWord[i] === event.key)
          {
            //this finds index
            //render current found list
            currentWordList[i] = event.key;
            console.log(i);

          }
        }

      }
      else
      {
        strikes++;
        if(strikes === 4)
        {
          //render lose here
          console.log("Lose")
        }
        //render strikes here
        console.log(strikes)
      }

      //if currentWordList === currentWord render win screen
      guessedLetters.push(event.key);
      console.log(currentWordList);
      console.log(guessedLetters);


    }
    else {
      console.log("already guessed that")
    }
  };

}

function userInput()
{
  //check if guessed letter is part of current word
  //if letter isnt part of word playerWrong()
  //if letter is part of word playerRight
}

function playerRight()
{
  //
}

function playerIsWrong()
{
  //update strikes
  //if strikes === 0 playerLose
}

function playerLose()
{
  //render game over screen, with play again button
}

function startGame()
{
  //First we need to get all the game data for said game, the game will be in last callback
  //call list APIs
  //send to imageAPI

  listRequest.addEventListener("load", callWordAPI)
  listRequest.open("GET" , listAPI);
  listRequest.send();
}

function callWordAPI()
{
  //This API is the callback of the list and formats it in a way to call the next api call
  //for the image can use it
  let dogBreedList = formatDogBreedsAPI(this.response);
  //pick random dog breed
  currentWord = pickRandomDogBreed(dogBreedList);
  let imgAPICall = imageAPI.replace("CHANGE" , createImgCall(currentWord));


  imageRequest.addEventListener("load", gamePlay)
  imageRequest.open("GET" , imgAPICall);
  imageRequest.send();

  return true;
  //now for the image api request that leads into a
}

function formatDogBreedsAPI(dogJSON)
{
  //parse the JSON recieved from API, message is where the needed data is
  const parsedDogBreeds = JSON.parse(dogJSON).message;
  //empty declatation to push finished dog breeds to
  let dogBreedList = [];

  //This loops through the dog breeds
  for(let breed in parsedDogBreeds)
  {
    //checks if it has sub breeds
    if(parsedDogBreeds[breed].length !== 0)
    {
      //loops through sub breeds concating the sub breed in front of the breed
      //for game format
      for(let i = 0; i < parsedDogBreeds[breed].length; i++)
      {
        dogBreedList.push(parsedDogBreeds[breed][i] + " " + breed);
      }
    }
    else
    {
      //if no sub breeds then just push the breed
      dogBreedList.push(breed);
    }
  }
  //return completed list
  return dogBreedList;
}

function pickRandomDogBreed(dogBreedList)
{
  //get random number between 0 and array length (no -1 needed due to nature of math.floor)
  let randomNumber = Math.floor(Math.random() * Math.floor(dogBreedList.length));

  return dogBreedList[randomNumber];
}

function createImgCall(dogBreed)
{
  //if Contains space, switch words
  //if no space do nothing
  //this makes the dogBreed compatible with dog api which is in the format breed/subbreed
  if(dogBreed.indexOf(" ") > 0)
  {
    let breed = dogBreed.substring(dogBreed.indexOf(" "), dogBreed.length);
    let subBreed = dogBreed.substring(0 , dogBreed.indexOf(" "));
    dogBreed = breed.trim() + "/" + subBreed.trim();
  }
  return dogBreed;

}
