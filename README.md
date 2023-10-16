# trøffelbot
A Discord bot for managing *MiddagsTFT*, a proud COMTEK tradition.

## Features
trøffelbot uses the Riot API to automatically keep track of who's winning Teamfight Tactics matches played during the lunch break. It constantly monitors the participants' match histories and maintains a scoreboard. The scoreboard is updated and displayed in a Discord channel every time a new game of MiddagsTFT is played.

trøffelbot also issues a daily MiddagsTFT reminder.

## Commands
__Team management__
- `/addteam`: Add a team to the competition.
- `/addplayer`: Add a player to a team.
- `/removeteam`: Remove a team from the competition.
- `/removeplayer`: Remove a player from the competition.
- `/setscore`: Overwrite the score of a team manually. The bot will update scores automatically, but this is a handy feature in case something goes wrong.
- `/status`: Display the current scoreboard.

__Bot configuration__
- `/setchannel`: Choose the channel where trøffelbot should post its updates and reminders.
- `/ping`: Verify that the bot is still running.

## Installation
Clone the project and install the dependencies.
```
git clone https://github.com/JeppW/troffelbot
cd troffelbot
npm install
```

Setup a MongoDB database. This can be done easily and for free using [MongoDB Atlas](https://www.mongodb.com/atlas/database).

Create an .env file like the example below (the keys below are dummy values and will not work).

```
MONGODB_URI=mongodb+srv://[user]:[password]@your.database.mongodb.net/?retryWrites=true&w=majority
DISCORD_TOKEN=NzQ4NjA2MjcyMzYxOTcyMDAx.X0hVwQ.Vua39sn8PFOuG8DzgCk9MFqxyz4
DISCORD_APPLICATION_ID=157730590492196864
RIOT_TOKEN=RGAPI-516b8a0e-6172-11ee-8c99-0242ac120002
RIOT_CLUSTER=europe
RIOT_REGION=euw1
TIMEZONE=Europe/Copenhagen
MIDDAGSTFT_EMOJI_ID=1039887656017989753
```

Run the application.
```
npm start
```