let imageRequest = new XMLHttpRequest();
let listRequest = new XMLHttpRequest();

const domCurrentList = document.getElementById("current-list");
const domStrikes = document.getElementById("strikes");
const domGuessedLetters = document.getElementById("guessed-letters");
const domImg = document.getElementById("image");
const domFails = document.getElementById("fail-count");
const domFriends = document.getElementById("friend-count");

let currentWord = null;
let currentImage = null;
let strikes = 0;
let friends = 0;
let fails = 0;

let currentWordList = [];
let guessedLetters = [" "];


const listAPI = "https://dog.ceo/api/breeds/list/all";
const imageAPI = "https://dog.ceo/api/breed/CHANGE/images/random";

const letterList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
"q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


startGame();



function startGame()
{
  domCurrentList.innerHTML = "Penelope needs some help! She is trying to make new friends and wants to know what \
      breed they are to look smart. Don't let her down! Press any button to continue"

      //update img to penelope hugging stuffed animal
      document.onkeyup = function(event)
      {
        grabGameInfo();
      }
}

function roundWon()
{
  domCurrentList.innerHTML = "Wow she made a new friend! Look how happy she is! Press a button \
      to help her make another friend";

  domImg.src = "assets/images/pphappy.jpg";
  friends++;
  domFails.innerHTML = fails.toString();
  domFriends.innerHTML = friends.toString();

    //reset values
  strikes = 0;
  guessedLetters = [" "];
  document.onkeyup = function(event)
  {
    grabGameInfo();
  }

}

function roundLost()
{

  domCurrentList.innerHTML = "She's not too happy, you made her look stupid and they didn't want to be \
    her friend. Press any button to try and redeem yourself";

  domImg.src = "assets/images/ppserious.jpg";
  fails++;
  domFails.innerHTML = fails.toString();
  domFriends.innerHTML = friends.toString();

    //reset values
  strikes = 0;
  guessedLetters = [" "];
  console.log("here");
  document.onkeyup = function(event)
  {
    grabGameInfo();
  }
}

function gamePlay()
{
  //img var make global with changeable src Maybe add src?


  currentWordList= Array(currentWord.length).fill("_");
  //fill in space where needed

  currentWordList[currentWord.indexOf(" ")] = "-";
  currentWord[currentWord.indexOf(" ")] = "-";
  //render word

  //move; for now render everything
  domImg.src = JSON.parse(this.response).message;
  domCurrentList.innerHTML = currentWordList.join(" ");
  domGuessedLetters.innerHTML = guessedLetters.join(" ");
  domStrikes.innerHTML = strikes.toString();
  domFails.innerHTML = fails.toString();
  domFriends.innerHTML = friends.toString();

  //get input
document.onkeyup = function(event)
{

  //first check if user has already put in input make sound if he has also make sure inputs a letter
  if(letterList.indexOf(event.key) !== -1 && guessedLetters.indexOf(event.key) === -1)
  {
      //if wrong render strikes
      //if strikes === 4 render lose screen
      //reset
    if(currentWord.indexOf(event.key) !== -1)
    {
      //find all occurences in word and fill them in
      //function here
      for(var i = 0; i < currentWord.length; i++)
      {
        if(currentWord[i] === event.key)
        {
          //this finds index
          //render current found list
          currentWordList[i] = event.key;



        }
      }

    }
    else
    {
      strikes++;
      //render strikes here; function here
    }

    //should we render whole page or just needed sections?
    //if currentWordList === currentWord render win screen
    //all renders in function(s)
    guessedLetters.push(event.key);

    //render everything again besides image
    domCurrentList.innerHTML = currentWordList.join(" ");
    domGuessedLetters.innerHTML = guessedLetters.join(" ");
    domStrikes.innerHTML = strikes.toString();
    //====



    //win and lose here
    if(strikes === 4)
    {
      //render lose here
      //function here
      roundLost();
    }


    if(!currentWordList.includes("_"))
    {
        roundWon();
    }


  }
  else {
    console.log("invalid or guessed letter")
  }
};

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
