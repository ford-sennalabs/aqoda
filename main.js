
const fs = require("fs");
const Hotel = require("./model/Hotel");

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);
  let hotel;

  commands.forEach((command) => {
    switch (command.name) {
      case "create_hotel":
        const [floors, amountOfRoomPerFloor] = command.params;
        hotel = new Hotel({ floors, amountOfRoomPerFloor });

        // console.log(
        //   `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        // )
        return;
      case "book":
        const [number, name, age] = command.params;
        hotel.roomBook(number, name, age);
        return;
      case "list_available_rooms":
        hotel.findAvailableRoom();
        return;
      case "checkout":
        const [cardId, guessName] = command.params;
        hotel.roomCheckOut(cardId, guessName);
        return;
      case "list_guest":
        hotel.listGuest();
        return;
      case "get_guest_in_room":
        const [roomNo] = command.params;
        hotel.listGuestInRoom(roomNo);
        return;
      case "list_guest_by_age":
        const [operator,ageRange] = command.params;
        hotel.listGuestByAge(operator,ageRange);
        return;
      case "list_guest_by_floor":
        const [fl] = command.params;
        hotel.listGuestByFloor(fl);
        return;
      case "checkout_guest_by_floor":
        const [checkInfl] = command.params;
        hotel.checkoutGuestByFloor(checkInfl);
        return;
      case "book_by_floor":
        const [bookFl,bookerName,bookerAge] = command.params;
        hotel.bookByFloor(bookFl,bookerName,bookerAge);
        return;
      default:
        return;
    }
  });
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8");

  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10);

            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );
}

main();
