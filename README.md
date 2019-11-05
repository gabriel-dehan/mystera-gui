# Mystera GUI 

# Features

## Commands autocomplete

## Shortcuts

Use / Drop -> FOR THIS TO WORK YOU NEED TO HAVE CORRECTLY RESET YOUR ACTION THEN TOGGLED IT AGAIN IN THE OPTIONS
Backpack -> FOR THIS TO WORK YOU NEED TO HAVE CORRECTLY RESET YOUR BACKPACK TO SHOW WITHOUT THE GUI
Craft -> 

## Header

### Server choice & auto login

[]

### Costumes [v2]

/costume list []
/costume choice (1..100) []

### Help

Basic commands []
Mystera GUI commands []
Chat commands []

### Logout

## Sidebar

### Users

Friends list [x]
  - Add friend [x]
  - Remove friend [x] 
  - List friends [x]
  - See friends button []
Ignore list []
  - Add ignored []
  - Remove ignored []
  - List ignored []
Report user []

### Quests

Show quests [x]
Reroll []

### Backpack

[]

### Inventory

[]

### Upgrade

Upgrade []

### Allow

Allow []

### Tower

/take []

### Sell

/price [amount] []

### Tribe

/tribe create []
/tribe list []
/tribe invite [player] []
/tribe kick [player] []
/tribe promote [player] []
/tribe demote [player] []
/tribe leave

### Pvp

Toggle PVP /pvp []

### Trade

/trade []

### Myst


### Swap [v2]

/swap ?

### Misc

/roll [sides]
/unstuck 


## Settings

Auto login []
Amount []: /drop amount (Number || all)
Chats []: /bchat, /tchat, /tcchat
Notifiable []: /notify
Dpad toggle []
Action toggle []
Permatchat toggle []
Font size (9-16) []
Chat width [] (30-100)
Chat opacity [] (0-100)
Fps (v2) []
Ping (v2) []

# Advice to new users

Reset your settings :
- RESET YOUR ACTION THEN SET IT IN THE SETTINGS
- RESET YOUR INVICONS
- Reset your quickuse
- enable /bchat
- enable /tchat
- enable /tcchat
- Amount to all
- Notify to "visible"
- Font size to X
- Dpad on
- Reset your permachat, chat width and opacity

Add your existing friends so the app can track them

# Development

All UI elements position mappings are in `src/Config/UI*.json` files.
For all coordinate values, the value in the files have been compiled using a Browser window width of 1024px (930 * 522.66 actual game size (`canvas` element)).
This means that for all relative positioning (needed to handle multiple resolutions and client window sizes), the code does a difference between the actual resolution and 930 * 522.66.
If you ever want to map other in game UI elements, please make sure the `canvas` element dimensions are exactly the ones cited above.