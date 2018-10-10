let imageRequest = new XMLHttpRequest();
let listRequest = new XMLHttpRequest();

const domCurrentList = document.getElementById("current-list");
const domStrikes = document.getElementById("strikes");
const domGuessedLetters = document.getElementById("guessed-letters");
const domImg = document.getElementById("image");
const domFails = document.getElementById("fail-count");
const domFriends = document.getElementById("friend-count");

const imgWon = "assets/images/pphappy.jpg";
const imgLose = "assets/images/ppserious.jpg";

let currentWord = null;
let currentImage = null;
let strikes = 0;
let friends = 0;
let fails = 0;

let currentWordList = [];
let guessedLetters = [];


const listAPI = "https://dog.ceo/api/breeds/list/all";
const imageAPI = "https://dog.ceo/api/breed/CHANGE/images/random";

const letterList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
"q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


startGame();



function startGame()
{

  renderScreen(false);

  //override screen render
  domCurrentList.innerHTML = "Penelope needs some help! She is trying to make new friends and wants to know what \
      breed they are to look smart. Don't let her down! Press any button to continue"

  startGameOnClick();
}

function gamePlay()
{

  formatCurrentWordList();
  renderScreen(JSON.parse(this.response).message);
  playerInput();

}

function playerInput()
{
  document.onkeyup = function(event)
  {
    //Check against alphabet array and against already played letters
    if(letterList.indexOf(event.key) !== -1 && guessedLetters.indexOf(event.key) === -1)
    {
      checkInput(event.key);
      //push guessed letter to the array for rendering
      guessedLetters.push(event.key);

      renderScreen(false);

      checkForGameEnd();
    }
  };
}

function formatCurrentWordList()
{
  //create desired look
  currentWordList = Array(currentWord.length).fill("_");
  //spaces dont render right so make - instead
  currentWordList[currentWord.indexOf(" ")] = "-";
}

function checkForGameEnd()
{
  if(strikes === 4)
  {
    roundLost();
  }
  else if(!currentWordList.includes("_"))
  {
      roundWon();
  }
}

function roundWon()
{
  //increment win counter
  friends++;
  //render screen
  renderScreen(imgWon);

  //override part of screen render
  domCurrentList.innerHTML = "Wow she made a new friend! Look how happy she is! Press a button \
      to help her make another friend";

  //resetVariables();
  resetVariables();
  //listen to start game on button click
  startGameOnClick();

}

function roundLost()
{
  //increment lose counter
  fails++;
  //render screen
  renderScreen(imgLose);

  //override screen render
  domCurrentList.innerHTML = "She's not too happy, you made her look stupid and they didn't want to be \
    her friend. Press any button to try and redeem yourself";

  //resetVariables();
  resetVariables();
  //listen to start game on button click
  startGameOnClick();
}
function checkInput(input)
{
  if(currentWord.indexOf(input) !== -1)
  {
    findAllLetters(input);
  }
  else
  {
    strikes++;
  }
}

function findAllLetters(letter)
{
  for(let i = 0; i < currentWord.length; i++)
  {
    if(currentWord[i] === letter)
    {
      //this finds index
      currentWordList[i] = letter;
    }
  }
}

function renderScreen(imgSrc)
{
  domCurrentList.innerHTML = currentWordList.join(" ");
  domGuessedLetters.innerHTML = guessedLetters.join(" ");
  domStrikes.innerHTML = strikes.toString();
  domFails.innerHTML = fails.toString();
  domFriends.innerHTML = friends.toString();
  if(imgSrc !== false)
  {
    domImg.src = imgSrc;

  }
}

function grabGameInfo()
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

function startGameOnClick()
{
  document.onkeyup = function(event)
  {
    grabGameInfo();
  }
}

function resetVariables()
{
  strikes = 0;
  guessedLetters = [];
  currentWordList = [];
  currentWord = null;
}
