import { mappedPositions } from './mapped-positions.ts';
import type { Landmark } from './types.ts';
const approx={en:'Approximate model · proportions and details are not surveyed.',si:'ආසන්න ආකෘතියකි · ප්‍රමාණ සහ විස්තර මැනුම් මත පදනම් නොවේ.'};
const wiki={label:'Mihintale — site overview',url:'https://en.wikipedia.org/wiki/Mihintale'};
export const landmarks:Landmark[]=[
 {id:'maha-seya',name:{en:'Maha Seya',si:'මහා සෑය'},category:{en:'Sacred stupa',si:'පූජනීය ස්තූපය'},description:{en:'The great white stupa crowns the southern summit. Its broad dome and terraces remain an important focus of worship at Mihintale today.',si:'දකුණු කඳු මුදුනේ පිහිටි විශාල සුදු දාගැබයි. එහි ගර්භය සහ පේසාවළලු අදත් මිහින්තලා පුදබිමේ වැදගත් ස්ථානයකි.'},coordinates:[80.51680556,8.35044444],coordinateSource:{label:'Unique Sri Lanka — published DMS coordinate',url:'https://www.uniquesrilanka.com/heritage/maha-seya-mihintale'},coordinateStatus:'published',model:'maha',modelAccuracy:approx,references:[wiki],viewpoint:{offset:[95,85,115],targetHeight:14}},
 {id:'ambasthala',name:{en:'Ambasthala Stupa',si:'අම්බස්තල දාගැබ'},category:{en:'Sacred terrace',si:'පූජනීය මළුව'},description:{en:'A small white stupa set among stone pillars on the upper terrace. Buddhist tradition associates this place with the meeting of Mahinda and King Devanampiyatissa. OSM also names a different nearby footprint Ambasthala; this naming conflict is documented.',si:'ඉහළ මළුවේ ගල් කණු අතර පිහිටි කුඩා සුදු දාගැබකි. මහින්ද මහරහතන් වහන්සේ සහ දේවානම්පියතිස්ස රජුගේ හමුව මෙම ස්ථානය හා සම්බන්ධ බව බෞද්ධ සම්ප්‍රදායේ සඳහන් වේ.'},coordinates:[80.51775,8.3513],coordinateSource:{label:'OSM way 398907408 via Mapcarta (rounded centre)',url:'https://mapcarta.com/W398907408'},coordinateStatus:'published',model:'ambasthala',modelAccuracy:approx,references:[wiki,{label:'Sela Cetiya / Ambasthala',url:'https://en.wikipedia.org/wiki/Sela_Cetiya'}],viewpoint:{offset:[65,65,85],targetHeight:6}},
 {id:'aradhana-gala',name:{en:'Aradhana Gala',si:'ආරාධනා ගල'},category:{en:'Granite summit',si:'ගල් පර්වතය'},description:{en:'The Rock of Invitation rises beside the upper terrace. The exposed granite and summit railing are distinctive; the rock shape here is a simplified visual interpretation.',si:'ඉහළ මළුව අසල පිහිටි ආරාධනා ගල නිරාවරණ ගල් පර්වතයකි. මෙහි දැක්වෙන හැඩය සරල කළ දෘශ්‍ය නිරූපණයකි.'},coordinates:[80.5183,8.351],coordinateSource:{label:'OSM node 1402637230 via Mapcarta (rounded)',url:'https://mapcarta.com/N1402637230'},coordinateStatus:'published',model:'rock',modelAccuracy:approx,references:[wiki,{label:'Photographic reference — Dennis Sylvester Hurd',url:'https://commons.wikimedia.org/wiki/File:Mihintale_Rock.jpg'}],viewpoint:{offset:[100,65,75],targetHeight:15}},
 {id:'white-buddha',name:{en:'White Buddha statue',si:'සුදු බුද්ධ ප්‍රතිමාව'},category:{en:'Buddha statue',si:'බුද්ධ ප්‍රතිමාව'},description:{en:'The large seated white Buddha stands on a raised platform beside the upper terrace, reached by rock-cut steps. Its bright silhouette and raised hand are interpreted with simplified geometry.',si:'ඉහළ මළුව අසල ගල් පියගැටවලින් ළඟා විය හැකි උස් වේදිකාවක පිහිටි හිඳි සුදු බුද්ධ ප්‍රතිමාවයි. එහි ස්වරූපය මෙහි සරල කළ ආකෘතියකින් නිරූපණය කර ඇත.'},coordinates:[80.51755556,8.35180556],coordinateSource:{label:'Unique Sri Lanka — published DMS coordinate',url:'https://www.uniquesrilanka.com/heritage/mihintale-buddha-statue'},coordinateStatus:'published',model:'buddha',modelAccuracy:{en:'Photo-informed sculpted GLB · face, hand gesture and robes interpreted from photographs. Not a measured scan.',si:'ඡායාරූප ඇසුරෙන් නිර්මාණය කළ GLB ආකෘතියකි · මැනුම් කළ ස්කෑන් ආකෘතියක් නොවේ.'},references:[{label:'Photographic reference — Wikimedia Commons',url:'https://commons.wikimedia.org/wiki/File:Mihintale_Buddha_Statue.jpg'}],viewpoint:{offset:[12,10,30],targetHeight:8}},
 {id:'main-stairway',name:{en:'Main stairway & terraces',si:'ප්‍රධාන පියගැට පෙළ සහ මළු'},category:{en:'Stone stairway',si:'ගල් පියගැට පෙළ'},description:{en:'Mapped flights of steps connect the terraces. This viewpoint follows the northern stairway segment in the downloaded OSM extract. The main-stairway identification is an interpretation; connectivity and visitor access are not verified.',si:'සිතියම්ගත ගල් පියගැට පෙළ කඳුකර මළු සම්බන්ධ කරයි. මෙම දසුන OSM දත්තවල උතුරු පියගැට කොටසට අදාළ වේ. ප්‍රධාන පියගැට පෙළ ලෙස හඳුනාගැනීම අර්ථකථනයකි; මාර්ග සම්බන්ධතාව සහ ප්‍රවේශය තහවුරු කර නැත.'},coordinates:null,coordinateSource:null,coordinateStatus:'pending',model:'stairs',modelAccuracy:approx,references:[wiki],viewpoint:{offset:[35,35,55],targetHeight:2}},
 {id:'kantaka-cetiya',name:{en:'Kantaka Cetiya',si:'කණ්ඨක චෛත්‍යය'},category:{en:'Preserved ruins',si:'සංරක්ෂිත නටබුන්'},description:{en:'A surviving stupa mound with stepped circular terraces and carved frontispieces. It is shown as a weathered ruin, with no reconstructed ancient spire or roof.',si:'වටකුරු පේසාවළලු සහ කැටයම් කළ වාහල්කඩ සහිත ස්තූප නටබුන් වේ. පැරණි කොතක් හෝ වහලක් ප්‍රතිනිර්මාණය නොකර නටබුන් ලෙස නිරූපණය කර ඇත.'},coordinates:[80.51405556,8.35222222],coordinateSource:{label:'Unique Sri Lanka — published DMS coordinate',url:'https://www.uniquesrilanka.com/v2/heritage/kantaka-chethiya-at-mihintale'},coordinateStatus:'published',model:'ruin',modelAccuracy:approx,references:[wiki],viewpoint:{offset:[100,75,90],targetHeight:6}},
 {id:'naga-pokuna',name:{en:'Naga Pokuna',si:'නාග පොකුණ'},category:{en:'Rock-cut pond',si:'ගල් පොකුණ'},description:{en:'A pond associated with the monastic water system, distinguished by a cobra carving in the rock. The shoreline follows the downloaded OSM footprint. Its present water level and the carving details are not surveyed.',si:'භික්ෂූන්ගේ ජල අවශ්‍යතා හා බැඳුණු, ගලේ නාග රූපයක් කැටයම් කර ඇති පොකුණකි. ඉවුරු OSM සිතියම් දත්ත මත පදනම් වේ. වත්මන් ජල මට්ටම සහ කැටයම් විස්තර මැනුම් කර නැත.'},coordinates:[80.515648,8.350106],coordinateSource:{label:'SriLanka-Places — published coordinate, not independently checked',url:'https://www.srilanka-places.com/places/naga-pokuna'},coordinateStatus:'published',model:'pond',modelAccuracy:approx,references:[{label:'Naga Pokuna — heritage description',url:'https://www.uniquesrilanka.com/heritage/naga-pokuna-of-mihintale'}],viewpoint:{offset:[75,65,80],targetHeight:3}}
];
landmarks.push(...[
  {
    "id": "alms-hall",
    "name": {
      "en": "Alms Hall",
      "si": "දාන ශාලාව"
    },
    "category": {
      "en": "Monastic ruins",
      "si": "ආරාම නටබුන්"
    },
    "description": {
      "en": "The mapped Dana Salawa footprint marks the ruined refectory. Stone foundation courses and surviving-pillar character are represented here; the individual pillar count and wall heights are interpretive.",
      "si": "දාන ශාලාවේ නටබුන් OSM පාදම මත නිරූපණය කර ඇත. ගල් කණු ගණන සහ බිත්ති උස ආසන්න අර්ථකථනයකි."
    },
    "coordinates": null,
    "coordinateSource": null,
    "coordinateStatus": "pending",
    "model": "mapped-ruin",
    "modelAccuracy": {
      "en": "Mapped footprint · masonry heights and pillar spacing interpreted from references, not surveyed.",
      "si": "සිතියම්ගත පාදමකි · ගල් බිත්ති සහ කණු මැනුම් කර නැත."
    },
    "references": [
      {
        "label": "Mihintale — Sacred Island, S. Dhammika",
        "url": "https://www.buddhanet.net/sacred-island/mihintale/"
      }
    ],
    "viewpoint": {
      "offset": [
        36,
        32,
        45
      ],
      "targetHeight": 2
    }
  },
  {
    "id": "relic-house",
    "name": {
      "en": "Relic House",
      "si": "ධාතු මන්දිරය"
    },
    "category": {
      "en": "Monastic ruins",
      "si": "ආරාම නටබුන්"
    },
    "description": {
      "en": "The Da Ge is mapped beside the hall complex. The roofless representation follows its mapped footprint, with low masonry and interpretive surviving columns. It does not reconstruct the ancient building.",
      "si": "ධාතු මන්දිරයේ සිතියම්ගත පාදම මත පහත් ගල් බිත්ති සහ ආසන්න කණු නිරූපණය කර ඇත. පැරණි ගොඩනැගිල්ල ප්‍රතිනිර්මාණය කර නැත."
    },
    "coordinates": null,
    "coordinateSource": null,
    "coordinateStatus": "pending",
    "model": "mapped-ruin",
    "modelAccuracy": {
      "en": "Mapped footprint · masonry heights and pillar spacing interpreted from references, not surveyed.",
      "si": "සිතියම්ගත පාදමකි · ගල් බිත්ති සහ කණු මැනුම් කර නැත."
    },
    "references": [
      {
        "label": "Mihintale — Sacred Island, S. Dhammika",
        "url": "https://www.buddhanet.net/sacred-island/mihintale/"
      }
    ],
    "viewpoint": {
      "offset": [
        36,
        32,
        45
      ],
      "targetHeight": 2
    }
  },
  {
    "id": "assembly-hall",
    "name": {
      "en": "Assembly Hall",
      "si": "සන්නිපාත ශාලාව"
    },
    "category": {
      "en": "Monastic ruins",
      "si": "ආරාම නටබුන්"
    },
    "description": {
      "en": "The Sannipata Sala is a roofless meeting-hall ruin with a raised stone foundation and standing pillars. The photograph in the reference panel documents its character; geometry follows the mapped footprint, with unsurveyed masonry detail.",
      "si": "සන්නිපාත ශාලාව ගල් පාදමක් සහ කණු සහිත වහල රහිත නටබුන් ගොඩනැගිල්ලකි. පාදම සිතියම් දත්ත මත පදනම් වන අතර විස්තර ආසන්න වේ."
    },
    "coordinates": null,
    "coordinateSource": null,
    "coordinateStatus": "pending",
    "model": "mapped-ruin",
    "modelAccuracy": {
      "en": "Mapped footprint · masonry heights and pillar spacing interpreted from references, not surveyed.",
      "si": "සිතියම්ගත පාදමකි · ගල් බිත්ති සහ කණු මැනුම් කර නැත."
    },
    "references": [
      {
        "label": "Mihintale — Sacred Island, S. Dhammika",
        "url": "https://www.buddhanet.net/sacred-island/mihintale/"
      }
    ],
    "viewpoint": {
      "offset": [
        36,
        32,
        45
      ],
      "targetHeight": 2
    }
  },
  {
    "id": "image-house",
    "name": {
      "en": "Image House ruins",
      "si": "පිළිම ගෙයි නටබුන්"
    },
    "category": {
      "en": "Monastic ruins",
      "si": "ආරාම නටබුන්"
    },
    "description": {
      "en": "A small mapped Image house ruin south of the main hall complex. Only the recorded footprint and low interpretive masonry are shown; the original roof and interior have not been reconstructed.",
      "si": "ප්‍රධාන ශාලා සංකීර්ණයට දකුණින් සිතියම්ගත පිළිම ගෙයි නටබුන් පිහිටා ඇත. වහලක් හෝ ඇතුළත කොටස් ප්‍රතිනිර්මාණය කර නැත."
    },
    "coordinates": null,
    "coordinateSource": null,
    "coordinateStatus": "pending",
    "model": "mapped-ruin",
    "modelAccuracy": {
      "en": "Mapped footprint · masonry heights and pillar spacing interpreted from references, not surveyed.",
      "si": "සිතියම්ගත පාදමකි · ගල් බිත්ති සහ කණු මැනුම් කර නැත."
    },
    "references": [
      {
        "label": "Mihintale — Sacred Island, S. Dhammika",
        "url": "https://www.buddhanet.net/sacred-island/mihintale/"
      }
    ],
    "viewpoint": {
      "offset": [
        36,
        32,
        45
      ],
      "targetHeight": 2
    }
  }
] as Landmark[]);
for(const landmark of landmarks){const mapped=(mappedPositions as Record<string,{coordinates:number[];source:{label:string;url:string}}>)[landmark.id];if(mapped){if(landmark.coordinateSource)landmark.references.push(landmark.coordinateSource);landmark.coordinates=mapped.coordinates as [number,number];landmark.coordinateSource=mapped.source;landmark.coordinateStatus='mapped'}}
export const tourIds=['main-stairway','ambasthala','white-buddha','aradhana-gala','maha-seya','naga-pokuna','kantaka-cetiya'];
