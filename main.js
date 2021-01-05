const fs = require('fs')

class Command {
  constructor(name, params) {
    this.name = name
    this.params = params
  }
}

class Hotel {

  constructor(props) {
    this.floors = props.floors;
    this.roomPerFloors = props.amountOfRoomPerFloor;
    const roomsAmout = props.amountOfRoomPerFloor * props.floors;
    this.guess = [];
    this.keycards = Array.from({ length: roomsAmout }).map((_, i) => {
      return new KeyCard({keyCardNo:i+1});
    });

    this.rooms = Array.from({ length: roomsAmout }).map((_, i) => {
      const floorNo = Math.floor(i/this.roomPerFloors)+1;
      const roomNumber =  (i+1) % this.roomPerFloors === 0 ? this.roomPerFloors:(i+1) % this.roomPerFloors
      return new Room({roomNo:floorNo.toString()+'0'+roomNumber});
    });


    console.log(
      `Hotel created with ${props.floors} floor(s), ${this.roomPerFloors} room(s) per floor.`
    )

  }

  findRoom(roomNo){
  const foundRoomIndex = this.rooms.findIndex((room)=>room.roomNo == roomNo)
    return this.rooms[foundRoomIndex]

  }

  findKeyCard(cardNo){
    const selectedKeyCardIndex = this.keycards.findIndex((keyCard)=> keyCard.keyCardNo === cardNo);
    return this.keycards[selectedKeyCardIndex];

  }

  listGuest(){
   const guessNames = this.guess.map((person)=>person.name);

   console.log(guessNames);

  }

  roomBook(roomNo,name,age){
    const findRoom = this.findRoom(roomNo);

    if(findRoom.available){
      const newGuess = new Guess({name,age})
      const selectedKeyCardIndex = this.keycards.findIndex((keyCard)=>!keyCard.roomNo);
      this.guess.push(newGuess);
      findRoom.checkIn(newGuess, this.keycards[selectedKeyCardIndex].keyCardNo);
      this.keycards[selectedKeyCardIndex].roomNo = findRoom.roomNo

      console.log(
          `Room ${findRoom.roomNo} is booked by ${newGuess.name} with keycard number ${this.keycards[selectedKeyCardIndex].keyCardNo}.`
      )
    }
    else{
      console.log(
          `Cannot book room ${findRoom.roomNo} for ${name}, The room is currently booked by ${findRoom.guess.name}`
      )

    }

  }

  findAvailableRoom(){
    const findRoomAvailable = this.rooms.filter((room)=>room.available).map((room)=>room.roomNo);
    console.log(
        `${findRoomAvailable}`
    )

  }

  roomCheckOut(cardId,guessName){
    const keyCard = this.findKeyCard(cardId);
    const room = this.findRoom(keyCard.roomNo);

    if(guessName === room.guess.name){
      room.checkOut()
      const foundGuessIndex = this.guess.findIndex((guess)=>{
        return guess.roomNo === keyCard.roomNo
      })
      this.guess.splice(foundGuessIndex,1);
      keyCard.roomNo = null;
      console.log(`Room ${room.roomNo} is checkout.`);
    }
    else{
      console.log(`Only ${room.guess.name} can checkout with keycard number ${room.keycardNo}.`);
    }
  }


}

class KeyCard {
  constructor(props) {
    this.roomNo = props.roomNo;
    this.keyCardNo = props.keyCardNo;
  }


}

class Room {
  constructor(props) {
    this.roomNo = props.roomNo;
    this.available = true;
    this.guess = null;
    this.keycardNo = null;
  }

  checkIn(guess,keycardNo){
    this.available = false;
    this.guess = guess;
    this.keycardNo = keycardNo;
  }


  checkOut(){
    this.available = true;
    this.guess = null;
  }

}

class Guess{
  constructor(props) {
    this.name = props.name;
    this.age = props.age;
  }

}


function main() {
  const filename = 'input.txt'
  const commands = getCommandsFromFileName(filename)
  let hotel;

  commands.forEach(command => {
    switch (command.name) {
      case 'create_hotel':
        const [floors, amountOfRoomPerFloor] = command.params
        hotel = new Hotel({floors, amountOfRoomPerFloor });

        // console.log(
        //   `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        // )
        return
      case 'book':
        const [number, name,age] = command.params;
        hotel.roomBook(number, name,age);
        return
      case 'list_available_rooms':
        hotel.findAvailableRoom();
        return
      case 'checkout':
        const [cardId, guessName] = command.params;
        hotel.roomCheckOut(cardId, guessName);
        return
      case 'list_guest':
        hotel.listGuest();
        return
      default:
        return
    }
  })
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, 'utf-8')

  return file
    .split('\n')
    .map(line => line.split(' '))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map(param => {
            const parsedParam = parseInt(param, 10)

            return Number.isNaN(parsedParam) ? param : parsedParam
          })
        )
    )
}

main()
