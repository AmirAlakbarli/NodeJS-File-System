require("colors");
const yargs = require("yargs");
const fs = require("fs");
const Table = require("cli-table");

function firstStep(arg) {
  const db = {};
  db["notes"] = [];
  db["notes"].push({ title: arg.title, body: arg.body ? arg.body : "" });

  fs.writeFile("db.json", JSON.stringify(db), (err) => {
    if (err) console.log("Cannot write data to file");
  });
}

yargs
  .command({
    command: "add",
    describe: "Add a note",
    builder: {
      title: {
        describe: "Enter the title of the note which you want to add",
        demandOption: "Title is required",
      },
    },

    handler: (arg) => {
      fs.readFile("db.json", "utf-8", (err, data) => {
        if (err?.code === "ENOENT") {
          firstStep(arg);
        } else {
          if (data) {
            const prevData = JSON.parse(data);

            if (prevData?.notes.some((note) => note.title === arg.title)) {
              console.log("Note with this title already exist".red);
              return;
            }

            prevData.notes.push({
              title: arg.title,
              body: arg.body ? arg.body : "",
            });
            fs.writeFile("db.json", JSON.stringify(prevData), (err) => {
              if (err) console.log(err);
            });
          } else {
            firstStep(arg);
          }
        }
        console.log(
          `{title:${arg.title}, body:${arg.body}} added to db.json`.blue
        );
      });
    },
  })

  .command({
    command: "list",
    describe: "List all notes",
    handler: () => {
      fs.readFile("db.json", "utf-8", (err, data) => {
        if (err?.code === "ENOENT") {
          console.log("File not found".red);
          return;
        } else {
          if (data) {
            const table = new Table({
              head: ["Title".green, "Body".green],
              colWidths: [50, 50],
            });

            const allNotes = JSON.parse(data).notes;
            allNotes.forEach((note) => {
              table.push([note.title, note.body]);
            });
            console.info(table.toString());
          } else {
            console.log("Note not found".red);
          }
        }
      });
    },
  })

  .command({
    command: "remove",
    description: "Remove a note",
    builder: {
      title: {
        describe: "Enter the title of the note which you want to remove",
        demandOption: "Title is required",
      },
    },
    handler: (arg) => {
      fs.readFile("db.json", "utf-8", (err, data) => {
        if (err?.code === "ENOENT") {
          console.log("File not found".red);
          return;
        } else {
          if (data) {
            const prevData = JSON.parse(data);
            const newNotes = prevData.notes.filter(
              (note) => note.title !== arg.title
            );
            if (newNotes.length === prevData.notes.length) {
              console.log("Note which have this title not found".red);
              return;
            }
            const newData = { ...prevData, notes: newNotes };
            fs.writeFile("db.json", JSON.stringify(newData), (err) => {
              if (err) {
                console.log("Note cannot be removed".red);
                return;
              } else {
                console.log(`title with ${arg.title} removed`.blue);
              }
            });
          } else {
            console.log("Note not found".red);
          }
        }
      });
    },
  })

  .command({
    command: "removeAll",
    description: "Remove all notes",
    handler: () => {
      fs.open("db.json", "w", (err, fd) => {
        if (err) {
          console.log("Cannot open the file to remove everything".red);
        }
        try {
          fs.write(fd, "", (err) => {
            if (err) {
              console.log("Cannot remove everything from file".red);
              return;
            } else
              console.log("Everything removed from file successfully".green);
          });
        } finally {
          fs.close(fd, (err) => {
            if (err) throw err;
          });
        }
      });
    },
  })

  .command({
    command: "update",
    description: "Update a note",
    builder: {
      title: {
        describe: "Enter the title of the note which you want to update",
        demandOption: "Title is required",
      },
      body: {
        describe: "Enter the body of the note which you want to update",
        demandOption: "Body is required",
      },
    },

    handler: (arg) => {
      fs.readFile("db.json", "utf-8", (err, data) => {
        if (err?.code === "ENOENT") {
          console.log("File not found".red);
          return;
        } else {
          if (data) {
            const prevData = JSON.parse(data);
            const updatedNote = prevData.notes.find(
              (note) => note.title === arg.title
            );

            if (updatedNote) updatedNote.body = `${arg.body}`;
            else {
              console.log("Note with this title does not exist".red);
              return;
            }
            const updatedData = JSON.stringify(prevData);
            fs.writeFile("db.json", updatedData, (err) => {
              if (err) {
                console.log("Cannot update a note".red);
              } else {
                console.log(`note with ${arg.title} title updated `.blue);
              }
            });
          } else {
            console.log("Note not found".red);
          }
        }
      });
    },
  })

  .help().argv;
