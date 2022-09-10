## Task for File Sytem in NodeJS

### Packages 📦

Here is a list of all the packages you will need to create this app:

- [Yargs' API](https://github.com/yargs/yargs)
- [cli-table](https://www.npmjs.com/package/cli-table)
- [colors](https://www.npmjs.com/package/colors)

---

### Task 🎯

Create **cli commands** that will **_add, list, remove, removeAll, update_** notes.
<br/>
All notes will be stored in **notes.json** file.
<br/>

1. **add** command must add the note with the _--title_ and _--body_. _Title_ property must be unique so if the user try to add a note with an existing title, then just display "Note with this title already exist" with red color 🔴

```
node app add --title="Some title" --body="Some body"
```

2. **list** command will simply display the entire list of notes.

```
node app list
```

3. **remove** command will remove note with the specified _--title_. If the user try to remove a note with a non-existing title, then just display "Note with this title does not exist" with red color 🔴

```
node app remove --title="Some title"
```

4. **removeAll** command will simply remove the entire list of notes.

```
node app removeAll
```

5. **remove** command will update the _--body_ of note with the specified _--title_. If the user try to update a note with a non-existing title, then just display "Note with this title does not exist" with red color 🔴

```
node app update --title="Some title" --body="Updated some body"
```
