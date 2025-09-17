import Point from './point.js';

export const ICON_HEIGHT_NUMERICAL = 6
export const ICON_HEIGHT = ICON_HEIGHT_NUMERICAL + 'vh'

const characterIdName = new Map([
  [266, "Aatrox"], [103, "Ahri"], [84, "Akali"], [166, "Akshan"], [12, "Alistar"], [799, "Ambessa"],
  [32, "Amumu"], [34, "Anivia"], [1, "Annie"], [523, "Aphelios"], [22, "Ashe"], 
  [136, "AurelionSol"], [893, "Aurora"], [268, "Azir"],

  [432, "Bard"], [200, "Belveth"], [53, "Blitzcrank"], [63, "Brand"], [201, "Braum"], [233, "Briar"],

  [51, "Caitlyn"], [164, "Camille"], [69, "Cassiopeia"], [31, "Chogath"], [42, "Corki"],

  [122, "Darius"], [131, "Diana"], [119, "Draven"], [36, "DrMundo"], 

  [245, "Ekko"], [60, "Elise"], [28, "Evelynn"], [81, "Ezreal"], 

  [9, "Fiddlesticks"], [114, "Fiora"], [105, "Fizz"], 

  [3, "Galio"], [41, "Gangplank"], [86, "Garen"], [150, "Gnar"], [79, "Gragas"], [104, "Graves"], 
  [887, "Gwen"], 

  [120, "Hecarim"], [74, "Heimerdinger"], [910, "Hwei"], 

  [420, "Illaoi"], [39, "Irelia"], [427, "Ivern"], 

  [40, "Janna"], [59, "JarvanIV"], [24, "Jax"], [126, "Jayce"], [202, "Jhin"], [222, "Jinx"],

  [145, "Kaisa"], [429, "Kalista"], [43, "Karma"], [30, "Karthus"], [38, "Kassadin"], 
  [55, "Katarina"], [10, "Kayle"], [141, "Kayn"],  [85, "Kennen"], [121, "Khazix"], 
  [203, "Kindred"], [240, "Kled"], [96, "KogMaw"], [897, "KSante"], 

  [7, "Leblanc"], [64, "LeeSin"], [89, "Leona"], [876, "Lillia"], [127, "Lissandra"], 
  [236, "Lucian"], [117, "Lulu"], [99, "Lux"], 

  [54, "Malphite"], [90, "Malzahar"], [57, "Maokai"], [11, "MasterYi"], [800, "Mel"], [902, "Milio"], 
  [21, "MissFortune"], [62, "MonkeyKing"], [82, "Mordekaiser"], [25, "Morgana"], 

  [950, "Naafiri"], [267, "Nami"], [75, "Nasus"], [111, "Nautilus"], [518, "Neeko"], 
  [76, "Nidalee"], [895, "Nilah"], [56, "Nocturne"], [20, "Nunu"], 

  [2, "Olaf"], [61, "Orianna"], [516, "Ornn"], 

  [80, "Pantheon"], [78, "Poppy"], [555, "Pyke"], 

  [246, "Qiyana"], [133, "Quinn"],

  [497, "Rakan"], [33, "Rammus"], [421, "RekSai"], [526, "Rell"], [888, "Renata"], [58, "Renekton"], 
  [107, "Rengar"], [92, "Riven"], [68, "Rumble"], [13, "Ryze"], 

  [360, "Samira"], [113, "Sejuani"], [235, "Senna"], [147, "Seraphine"], [875, "Sett"], 
  [35, "Shaco"], [98, "Shen"], [102, "Shyvana"], [27, "Singed"], [14, "Sion"], [15, "Sivir"], 
  [72, "Skarner"], [901, "Smolder"], [37, "Sona"], [16, "Soraka"], [50, "Swain"], [517, "Sylas"], 
  [134, "Syndra"], 

  [223, "TahmKench"], [163, "Taliyah"], [91, "Talon"], [44, "Taric"], [17, "Teemo"],
  [412, "Thresh"], [18, "Tristana"], [48, "Trundle"], [23, "Tryndamere"], [4, "TwistedFate"], 
  [29, "Twitch"],

  [77, "Udyr"], [6, "Urgot"], 

  [110, "Varus"], [67, "Vayne"], [45, "Veigar"], [161, "Velkoz"], [711, "Vex"], [254, "Vi"], 
  [234, "Viego"], [112, "Viktor"], [8, "Vladimir"], [106, "Volibear"],

  [19, "Warwick"], 

  [498, "Xayah"], [101, "Xerath"], [5, "XinZhao"], 

  [157, "Yasuo"], [777, "Yone"], [83, "Yorick"], [350, "Yuumi"], 

  [154, "Zac"], [238, "Zed"], [221, "Zeri"], [115, "Ziggs"], [26, "Zilean"], [142, "Zoe"], 
  [143, "Zyra"],
])


const points = [
  /* Blue Base */
  new Point(500, 500, 11, 80), // Blue Fountain
  new Point(1179, 1960, 20, 75), // Blue Nexus
  new Point(3000, 1100, 30, 75), // Blue Bot Inhib/T3 // TO CHECK
  new Point(3000, 3500, 30, 60), // Blue Mid Inhib/T3 // TO CHECK
  new Point(1100, 4500, 20, 55), // Blue Top Inhib/T3 // TO CHECK

  /* Red Base */
  new Point(14500, 14500, 73, 7), // Red Fountain
  new Point(13900, 13900, 67, 9), // Red Nexus // TO CHECK
  new Point(13900, 11600, 72, 18), // Red Bot Inhib/T3
  new Point(12000, 11500, 63, 18), // Red Mid Inhib/T3 // TO CHECK
  new Point(11404, 13000, 60, 10), // Red Top Inhib/T3

  /* Bot Lane */
  new Point(7211, 1418, 45, 74), // Blue T2
  new Point(), // Blue Side Bush  // TO DO
  new Point(10609, 1219, 65, 77), // Blue T1

  new Point(10315, 2980, 63, 65), // Blue Tribush
  new Point(), // Bot Lane Blue Bush // TO DO
  new Point(12413, 2551, 73, 67), // Bot Lane Center
  new Point(12872, 1725, 75, 73), // Bot Lane Central Bush
  new Point(), // Bot Lane River Bush // TO DO
  new Point(), // Bot Lane Red Bush // TO DO
  new Point(12097, 4406, 70, 56), // Red Tribush

  new Point(13393, 4010, 76, 57), // Red T1
  new Point(), // Red Side Bush // TO DO
  new Point(13900, 8000, 73, 35), // Red T2 // TO DO

  /* Mid Lane */
  new Point(5158, 5070, 36, 50), // Blue T2
  new Point(6800, 7462, 43, 42), // Blue T1

  new Point(5637, 6958, 43, 35), // Mid Lane Top Bush
  new Point(7300, 7250, 48, 39), // Mid Lane Center
  new Point(8643, 6340, 52, 45), // Mid Lane Bot Bush

  new Point(8000, 8000, 53, 32), // Red T1 // TO DO
  new Point(9500, 9500, 57, 27), // Red T2 // TO DO

  /* Top Lane */
  new Point(1100, 4900, 20, 38), // Blue T2 // TO DO
  new Point(), // Blue Side Bush // TO DO
  new Point(1011, 10775, 22, 20), // Blue T1

  new Point(2113, 9816, 25, 28), // Blue Tribush
  new Point(), // Top Lane Blue Bush // TO DO
  new Point(2054, 12683, 25, 13), // Top Lane Center
  new Point(3254, 11536, 30, 20), // Top Lane River Bush
  new Point(), // Top Lane Red Bush // TO DO
  new Point(), // Red Tribush // TO DO

  new Point(4379, 13578, 35, 9), // Red T1
  new Point(), // Red Side Bush // TO DO
  new Point(8000, 13900, 48, 7), // Red T2

  /* Red Bot Jungle */
  new Point(10629, 8639, 62, 33), // Wolves
  new Point(11500, 7150, 63, 40), // Blue buff
  new Point(12420, 6546, 70, 45), // Gromp
  new Point(), // River Bush // TO DO
  new Point(), // Mid bush // TO DO


  /* Red Top Jungle */
  new Point(6771, 12502, 43, 16), // Krugs
  new Point(7334, 11000, 45, 20), // Red buff
  new Point(), // Raptors // TO DO
  new Point(), // Raptors bush // TO DO

  /* Blue Bot Jungle */
  new Point(), // Krugs // TO DO
  new Point(7737, 3515, 48, 59), // Red buff
  new Point(), // Raptors // TO DO
  new Point(6548, 4682, 43, 55), // Raptors bush

  /* Blue Top Jungle */
  new Point(3311, 6572, 30, 45), // Wolves
  new Point(4652, 4860, 30, 36), // Blue buff
  new Point(), // Gromp // TO DO
  new Point(4531, 8528, 35, 33), // River Bush
  new Point(), // Mid bush // TO DO

  /* Objectives */
  new Point(4922, 10000, 35, 25), // Baron Pit
  new Point(7665, 6614, 59, 56), // Drake Pit
]

export const ranksToColour = {
  IRON: 'rgba(120, 100, 120, 1)',
  BRONZE: 'rgba(163, 115, 64, 1)',
  SILVER: 'rgba(192, 192, 192, 1)',
  GOLD: 'rgba(255, 215, 0, 1)',
  PLATINUM: 'rgba(114, 168, 255, 1)',
  EMERALD: 'rgba(0, 204, 102, 1)',
  DIAMOND: 'rgba(56, 174, 242, 1)',
  MASTER: 'rgba(243, 100, 200, 1)',
  GRANDMASTER: 'rgba(255, 20, 100, 1)',
  CHALLENGER: 'rgba(0, 102, 255, 1)',
}

  export function translateCoords(x, y) {
    var closest = new Point();
    var distance = Number.MAX_SAFE_INTEGER;
    for (let point of points) {
      const curr_dist = point.distance(x, y);
      if (curr_dist < distance) {
        closest = point;
        distance = curr_dist;
      }
    }
    return closest;
  }
  
  export function getCharacterImage(characterId) {
    return "/champions/" + characterIdName.get(characterId) + ".webp";
  }
  
  export function getItemImage(items, item) {
    if (!items || !items[item]) {
      return '/empty.png';
    }
    return `/items/${items[item].name}.webp`;
  }

  export function getRegion(matchId) {
    return matchId.split("_")[0];
  }

  export function getCharacterName(characterId) {
    return characterIdName.get(characterId);
  }

  export function getRankImg(rank) {
    return `/ranks/${rank}.webp`;
  }

  export function timeStampToMinutes(time) {
    const milisecondsToMinute = 60000 // Divide time by this value
    return Math.round(time / milisecondsToMinute);
  }