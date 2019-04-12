/* eslint-disable no-magic-numbers */

import { worldState } from './world.js';
import { widthCanvas, heightCanvas } from "./renderer/canvas.js";

const biomesIDs = [];
biomesIDs.push([ 2, 3, 3, 3, 3, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 18, 18, 18, 18, 18, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21 ]);
biomesIDs.push([ 2, 2, 3, 3, 3, 3, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 18, 18, 18, 18, 18, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21 ]);
biomesIDs.push([ 1, 2, 2, 3, 3, 3, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 18, 18, 18, 18, 18, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21 ]);
biomesIDs.push([ 1, 1, 2, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 18, 18, 18, 18, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21 ]);
biomesIDs.push([ 1, 1, 2, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 18, 18, 18, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21 ]);
biomesIDs.push([ 1, 1, 1, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 12, 12, 12, 12, 12, 12, 12, 12, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 18, 18, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21 ]);
biomesIDs.push([ 0, 1, 1, 1, 1, 2, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 18, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21 ]);
biomesIDs.push([ 0, 0, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21 ]);
biomesIDs.push([ 0, 0, 0, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21 ]);
biomesIDs.push([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 21 ]);

const biomesGrads = [];
biomesGrads.push([ '#b6d95d', '#aad453', '#9fcf4b', '#96cb44', '#8ec73f', '#88c53b', '#83c438', '#7fc236', '#7cc034', '#7abf33', '#78be32', '#77be32', '#76be33', '#75be34', '#73be35', '#6fbd37', '#6bbc3a', '#66bb3d', '#61ba40', '#5cb942', '#57b844', '#53b745', '#50b646', '#4eb347', '#4eb047', '#4eae46', '#4fac45', '#50aa44', '#51a844', '#52a644', '#52a544', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#52a444', '#53a343', '#54a242', '#559f40', '#569b3e', '#57973b', '#589238', '#598e35', '#5a8a33', '#5b8732', '#5c8532', '#5d8432', '#5d8533', '#5e8534', '#608535', '#648737', '#6b8b3c', '#769244', '#839a4f', '#90a35b', '#9dad6a', '#a8b87b', '#b1c38d', '#b9cd9f', '#c1d6b1', '#c9dec1', '#cfe5d0', '#d6ebdc', '#ddf0e6', '#e3f4ed', '#e8f7f2', '#ecfaf6', '#effcf9', '#f2fdfb', '#f4fdfd', '#f6fdfe', '#f8fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#fafeff' ]);
biomesGrads.push([ '#c5df67', '#b8d95d', '#abd455', '#9fd04e', '#95cc49', '#8bc944', '#84c841', '#7ec63f', '#79c43d', '#76c33c', '#73c23b', '#71c13b', '#6fc13c', '#6dc03d', '#6bc03d', '#68c03f', '#65bf41', '#61be44', '#5dbd46', '#59bc47', '#55bb49', '#51ba4a', '#4eb94b', '#4db64b', '#4db34a', '#4db149', '#4eaf48', '#4fae48', '#50ac48', '#50ab48', '#50aa48', '#50a948', '#50a948', '#50a948', '#51a948', '#51a847', '#51a847', '#52a847', '#52a847', '#52a847', '#52a847', '#52a847', '#52a847', '#52a847', '#53a847', '#53a847', '#54a847', '#54a847', '#55a847', '#55a847', '#57a847', '#58a847', '#58a747', '#59a746', '#5aa645', '#5ba343', '#5c9f41', '#5d9b3e', '#5d963b', '#5e9238', '#5e8e36', '#5f8a35', '#5f8835', '#608736', '#608736', '#618737', '#628737', '#658838', '#6b8b3c', '#759143', '#81984c', '#8ca057', '#99a965', '#a4b476', '#adbf88', '#b5ca9b', '#bed3ae', '#c6dcbe', '#cce3ce', '#d4e9da', '#dbefe5', '#e2f4ec', '#e7f7f2', '#ecfaf6', '#effcf9', '#f2fdfb', '#f4fdfd', '#f6fdfe', '#f8fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#fafeff' ]);
biomesGrads.push([ '#d2e572', '#c5de68', '#b7d95f', '#aad458', '#9ed153', '#93ce4e', '#8acc4b', '#82ca48', '#7cc846', '#78c745', '#74c645', '#71c545', '#6fc445', '#6dc446', '#6bc346', '#68c348', '#66c349', '#62c24b', '#5fc04d', '#5cbf4e', '#5abf4f', '#57be50', '#54bc50', '#54ba4f', '#53b84f', '#54b64e', '#54b44d', '#55b34d', '#56b24d', '#56b14d', '#56b04d', '#55b04d', '#55b04d', '#55b04d', '#57af4d', '#57ae4c', '#57ae4c', '#58ae4c', '#58ae4c', '#59ae4c', '#59ae4c', '#59ae4c', '#59ae4c', '#59ae4c', '#5aae4c', '#59af4c', '#5baf4c', '#5cae4c', '#5eae4c', '#5fae4c', '#61ad4c', '#62ad4c', '#63ac4c', '#64ac4b', '#65ab4a', '#66a949', '#67a547', '#67a144', '#679c41', '#68983e', '#68943c', '#68903b', '#678d3a', '#688c3b', '#678c3b', '#688b3b', '#688b3b', '#6b8b3c', '#708e3f', '#789245', '#82984c', '#8c9f56', '#97a763', '#a1b273', '#aabd85', '#b2c798', '#bbd1ab', '#c3dabc', '#cae1cc', '#d3e8d9', '#daeee4', '#e2f3eb', '#e7f7f1', '#ebf9f5', '#effcf9', '#f2fdfb', '#f4fdfd', '#f6fdfe', '#f8fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#fafeff' ]);
biomesGrads.push([ '#ddea7d', '#d1e373', '#c3de6a', '#b6d962', '#a9d55c', '#9ed258', '#94d055', '#8cce52', '#85cc50', '#80cb4f', '#7cca4f', '#79c94f', '#76c84f', '#74c84f', '#72c750', '#70c751', '#6ec752', '#6cc653', '#6ac454', '#68c454', '#66c455', '#64c356', '#63c155', '#63c055', '#62be55', '#62bc54', '#62bb53', '#63ba53', '#63b953', '#63b853', '#63b853', '#63b853', '#63b853', '#63b853', '#64b753', '#65b653', '#65b653', '#65b653', '#65b653', '#66b653', '#67b653', '#67b653', '#67b653', '#67b653', '#68b653', '#68b752', '#69b652', '#6ab652', '#6cb552', '#6eb552', '#6fb452', '#71b452', '#72b352', '#73b352', '#74b251', '#75b050', '#76ad4e', '#76a94c', '#75a549', '#75a047', '#759c45', '#749843', '#739542', '#739343', '#719242', '#719142', '#719042', '#739042', '#779244', '#7d9549', '#859a4e', '#8ea057', '#97a763', '#a0b172', '#a9bc84', '#b1c696', '#b9cfa9', '#c1d9bb', '#c9e0cb', '#d2e7d8', '#d9ede3', '#e1f2ea', '#e6f6f1', '#eaf9f5', '#eefbf9', '#f2fcfb', '#f4fcfd', '#f6fcfe', '#f8fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#f9fdfe', '#fafeff' ]);
biomesGrads.push([ '#e6ee88', '#dbe87e', '#cfe375', '#c3de6d', '#b7da67', '#acd762', '#a2d55f', '#9ad35c', '#93d15a', '#8ed059', '#8acf59', '#86ce59', '#84cd59', '#82cd59', '#81cc59', '#80cc5a', '#7ecc5a', '#7dcb5b', '#7bca5b', '#7aca5b', '#78ca5c', '#77c95c', '#76c75b', '#77c65b', '#76c55b', '#76c35b', '#76c25a', '#77c25a', '#77c15a', '#77c15a', '#76c15a', '#76c05a', '#76c05a', '#77c05a', '#78bf5a', '#78be5a', '#78be5a', '#78be5a', '#78be5a', '#79be5a', '#7abe5a', '#7abe5a', '#7abe5a', '#7abe5a', '#7abf5a', '#7bbf5a', '#7cbe5a', '#7dbe5a', '#7ebd5a', '#80bd5a', '#81bc5a', '#83bc5a', '#84bb5a', '#85bb5a', '#86ba59', '#87b858', '#87b657', '#87b255', '#86ae53', '#85aa51', '#84a54f', '#83a14d', '#819e4c', '#809b4c', '#7e994b', '#7d974b', '#7d964b', '#7e964a', '#81974c', '#86994f', '#8c9c53', '#93a15a', '#9aa865', '#a2b173', '#aabb83', '#b1c495', '#b8cda7', '#bfd7b9', '#c6dec9', '#cfe5d6', '#d6ebe1', '#def0e8', '#e4f4ef', '#e9f7f3', '#edf9f7', '#f0faf9', '#f2fbfb', '#f4fbfc', '#f6fcfd', '#f7fcfd', '#f7fcfd', '#f7fcfd', '#f7fdfd', '#f8fcfe', '#f8fdfe', '#f8fdfe', '#f8fdfe', '#f9fdff', '#f9fdff', '#fafeff' ]);
biomesGrads.push([ '#edf191', '#e4ec88', '#dae77f', '#cfe378', '#c5df73', '#bcdc6e', '#b3db6b', '#acd968', '#a6d866', '#a1d765', '#9dd665', '#9ad465', '#98d365', '#97d365', '#96d265', '#95d165', '#94d164', '#93d064', '#92d064', '#91cf64', '#90cf64', '#8fce64', '#8ecc63', '#8ecc63', '#8dcb63', '#8dca63', '#8dc962', '#8dc962', '#8dc862', '#8dc862', '#8cc862', '#8cc762', '#8cc762', '#8dc762', '#8ec662', '#8ec663', '#8ec663', '#8ec663', '#8ec663', '#8fc663', '#90c663', '#90c663', '#90c663', '#90c663', '#90c663', '#91c663', '#92c563', '#93c563', '#94c563', '#96c563', '#96c363', '#98c363', '#98c364', '#98c364', '#99c263', '#9ac062', '#9abe61', '#9abb60', '#99b85e', '#97b45c', '#96af5a', '#94ab59', '#92a758', '#90a457', '#8ea157', '#8c9e56', '#8b9d56', '#8c9c55', '#8d9c56', '#919d58', '#959f5b', '#9aa360', '#9fa969', '#a5b175', '#acb984', '#b2c294', '#b8caa5', '#bed3b6', '#c4dac5', '#cbe0d2', '#d3e6dc', '#d9eae3', '#dfeee9', '#e3f1ed', '#e7f3f0', '#eaf4f3', '#ecf5f5', '#eff6f6', '#f1f7f7', '#f2f8f8', '#f3f9f9', '#f4fafa', '#f4fbfb', '#f5fbfc', '#f6fcfd', '#f7fcfe', '#f7fdfe', '#f8fdff', '#f9fdff', '#fafeff' ]);
biomesGrads.push([ '#f2f399', '#ebef91', '#e4eb8a', '#dbe884', '#d4e57f', '#cde37b', '#c6e178', '#c0e076', '#bbdf74', '#b7de73', '#b4dd73', '#b1dc73', '#b0db73', '#b0db73', '#afda72', '#add972', '#add871', '#abd671', '#aad570', '#a9d470', '#a8d46f', '#a7d36e', '#a6d16e', '#a6d16d', '#a5d06d', '#a5cf6d', '#a5ce6d', '#a5ce6d', '#a5ce6d', '#a5ce6d', '#a4ce6d', '#a4cd6d', '#a4cd6d', '#a4cd6d', '#a4cd6d', '#a5cc6e', '#a5cc6e', '#a5cc6e', '#a5cc6e', '#a5cc6e', '#a6cc6e', '#a6cc6e', '#a6cc6e', '#a6cc6e', '#a6cc6e', '#a7cc6e', '#a8cb6e', '#a9cb6e', '#aacb6e', '#abcb6e', '#abca6e', '#acca6e', '#acca6f', '#acca6f', '#adc96e', '#adc86e', '#adc66d', '#adc46c', '#acc16b', '#aabe69', '#a8b968', '#a6b566', '#a3b065', '#a1ad64', '#9ea964', '#9ca663', '#9aa462', '#9aa261', '#9ba162', '#9ca263', '#9fa365', '#a2a569', '#a5aa6f', '#a9b179', '#aeb786', '#b3bf94', '#b7c6a3', '#bccdb1', '#c1d3bf', '#c6d9ca', '#ccded3', '#d2e1da', '#d7e5df', '#dbe7e3', '#dee9e6', '#e1eae9', '#e4eceb', '#e7eded', '#e9efef', '#ebf0f0', '#edf2f2', '#eff5f4', '#f1f7f6', '#f2f9f9', '#f4fafb', '#f5fbfc', '#f5fcfd', '#f7fdfe', '#f8fdff', '#fafeff' ]);
biomesGrads.push([ '#f6f5a1', '#f1f29a', '#ecf095', '#e7ee91', '#e2ec8e', '#deea8b', '#d9e988', '#d5e886', '#d2e885', '#cfe784', '#cde684', '#cbe684', '#cae584', '#cae584', '#c9e383', '#c7e283', '#c6e081', '#c4de80', '#c3dc7f', '#c1db7e', '#c0da7c', '#bfd97c', '#bdd77c', '#bcd67b', '#bcd57a', '#bbd47a', '#bbd37a', '#bbd37a', '#bbd37a', '#bbd37a', '#bbd37a', '#bbd37a', '#bbd37a', '#bbd37a', '#bbd37a', '#bbd27b', '#bbd27b', '#bbd27b', '#bbd27b', '#bbd27b', '#bcd27b', '#bcd27b', '#bcd27b', '#bcd27b', '#bcd27b', '#bdd27b', '#bdd17b', '#bdd17b', '#bed17b', '#bed17b', '#bed17b', '#bfd17b', '#bfd17c', '#bfd17c', '#c0d07c', '#c0cf7c', '#c0ce7c', '#bfcd7b', '#beca7a', '#bdc878', '#bbc377', '#b8bf75', '#b5ba74', '#b2b673', '#aeb272', '#abae71', '#a9ab70', '#a8a86f', '#a8a770', '#a8a770', '#a9a771', '#aaa873', '#acac77', '#aeb07e', '#b0b588', '#b3bb94', '#b5c0a0', '#b9c6ac', '#bccbb7', '#c0d0c1', '#c4d4c8', '#c9d6ce', '#cdd9d3', '#d0dad6', '#d3dcd9', '#d6dddc', '#d9dfde', '#dce1e1', '#e0e4e3', '#e3e6e6', '#e6eae9', '#eaedec', '#edf1f0', '#eff4f3', '#f1f6f6', '#f3f8f8', '#f4fafa', '#f6fcfc', '#f7fdfe', '#fafeff' ]);
biomesGrads.push([ '#f9f7a8', '#f6f6a4', '#f4f5a1', '#f1f49f', '#eff39e', '#edf29c', '#ebf19b', '#e9f199', '#e8f199', '#e6f098', '#e5f098', '#e4f098', '#e4ef98', '#e3ef98', '#e2ed97', '#e0ec96', '#dfea94', '#dde792', '#dae491', '#d8e28f', '#d6e08d', '#d4de8c', '#d2dc8c', '#d1db8b', '#d0da8a', '#cfd98a', '#cfd98a', '#cfd98a', '#cfd98a', '#cfd98a', '#cfd98a', '#cfd98a', '#cfd98a', '#cfd98a', '#cfd98a', '#cfd88a', '#cfd88a', '#cfd88a', '#cfd88a', '#cfd88a', '#d0d88a', '#d0d88a', '#d0d88a', '#d0d88a', '#d0d88a', '#d0d88a', '#d0d88a', '#d0d88a', '#d0d88a', '#d0d88a', '#d0d88a', '#d1d88a', '#d1d88b', '#d1d88b', '#d1d78b', '#d1d78b', '#d1d68b', '#d1d68b', '#d0d48a', '#cfd288', '#cdce87', '#cac986', '#c6c484', '#c2bf83', '#beba81', '#bbb680', '#b8b27f', '#b5af7e', '#b3ad7e', '#b2ac7e', '#b2ab7e', '#b2ac7f', '#b2ae81', '#b2b085', '#b2b38b', '#b3b794', '#b3bb9d', '#b5bfa7', '#b7c2af', '#bac6b7', '#bcc9bd', '#bfcac2', '#c3ccc6', '#c5ccc8', '#c7ceca', '#c9cfcd', '#cdd1d0', '#d1d3d3', '#d6d7d7', '#dadbdb', '#dfe0e0', '#e4e5e4', '#e8eae9', '#eceeed', '#eff2f1', '#f2f4f4', '#f3f7f7', '#f5f9f9', '#f7fcfc', '#fafeff' ]);
biomesGrads.push([ '#fbfaae', '#fbfaae', '#fbfaae', '#fbfaae', '#fbfaae', '#fbfaae', '#fbfaae', '#fbfaae', '#fbfaae', '#fbfaae', '#fbfaae', '#fbfaae', '#fbfaae', '#faf9ad', '#f9f8ac', '#f7f6ab', '#f5f4a9', '#f3f1a6', '#efeda4', '#eceaa2', '#e9e7a0', '#e6e49e', '#e4e29d', '#e2e09c', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9b', '#e1df9a', '#e0dd99', '#ded998', '#dbd497', '#d7cf95', '#d2c993', '#cdc391', '#c9be8f', '#c5b98f', '#c0b68e', '#bdb38d', '#bab28c', '#b9b08b', '#b8b08b', '#b7b08b', '#b5b08c', '#b3b18f', '#b2b394', '#b1b69b', '#b1b8a2', '#b2baa8', '#b3bcae', '#b4beb3', '#b6bfb6', '#b8bfb9', '#babfba', '#bbc0bc', '#bdc1bf', '#c1c3c2', '#c6c6c6', '#cbcbcb', '#d1d1d1', '#d7d7d7', '#dddddd', '#e3e3e3', '#e8e8e8', '#ededed', '#f0f1f1', '#f2f4f4', '#f4f7f7', '#f7fbfb', '#fafeff' ]);

const biomes = [
    {
        id: 0,
        name: 'Hot desert',
        temperature: 'hottest-hot',
        precipitation: 'superarid',
        color: '#fbfaae',
    },
    {
        id: 1,
        name: 'Savanna',
        temperature: 'hottest',
        precipitation: 'arid',
        color: '#eef586',
    },
    {
        id: 2,
        name: 'Tropical dry forest',
        temperature: 'hottest',
        precipitation: 'humid',
        color: '#b6d95d',
    },
    {
        id: 3,
        name: 'Tropical wet forest',
        temperature: 'hottest',
        precipitation: 'superhumid',
        color: '#7dcb35',
    },
    {
        id: 4,
        name: 'Xeric srubland',
        temperature: 'temperate-cold',
        precipitation: 'superarid',
        color: '#d6dd7f',
    },
    {
        id: 5,
        name: 'Temperate dry grassland',
        temperature: 'hot-temperate',
        precipitation: 'arid',
        color: '#bdde82',
    },
    {
        id: 6,
        name: 'Temperate wet grassland',
        temperature: 'hot-temperate',
        precipitation: 'subhumid',
        color: '#a1d77a ',
    },
    {
        id: 7,
        name: 'Temperate deciduous forest',
        temperature: 'hot-temperate',
        precipitation: 'humid',
        color: '#29bc56',
    },
    {
        id: 8,
        name: 'Subtropical rain forest',
        temperature: 'hot',
        precipitation: 'superhumid',
        color: '#76bd32',
    },
    {
        id: 9,
        name: 'Cold desert',
        temperature: 'temperate-cold',
        precipitation: 'superarid',
        color: '#e1df9b',
    },
    {
        id: 10,
        name: 'Temperate rain forest',
        temperature: 'temperate',
        precipitation: 'superhumid',
        color: '#45b348',
    },
    {
        id: 11,
        name: 'Coniferous wet forest',
        temperature: 'temperate',
        precipitation: 'superhumid',
        color: '#52a444',
    },
    {
        id: 12,
        name: 'Temperate coniferous forest',
        temperature: 'temperate',
        precipitation: 'humid',
        color: '#6fb252',
    },
    {
        id: 13,
        name: 'Subtaiga',
        temperature: 'cold',
        precipitation: 'superhumid',
        color: '#567c2c',
    },
    {
        id: 14,
        name: 'Boreal wet forest',
        temperature: 'cold',
        precipitation: 'humid',
        color: '#618a38',
    },
    {
        id: 15,
        name: 'Boreal dry forest',
        temperature: 'cold',
        precipitation: 'subhumid',
        color: '#a4b36d',
    },
    {
        id: 16,
        name: 'Subpolar scrub',
        temperature: 'cold',
        precipitation: 'arid',
        color: '#acb076',
    },
    {
        id: 17,
        name: 'Subpolar desert',
        temperature: 'cold-coldest',
        precipitation: 'superarid-arid',
        color: '#b5ad8b',
    },
    {
        id: 18,
        name: 'Tundra',
        temperature: 'coldest',
        precipitation: 'humid',
        color: '#d5d59d',
    },
    {
        id: 19,
        name: 'Rocky desert',
        temperature: 'coldes-frosty',
        precipitation: 'superarid',
        color: '#bfbfbf',
    },
    {
        id: 20,
        name: 'Polar desert',
        temperature: 'frosty',
        precipitation: 'any',
        color: '#f2f2f2',
    },
    {
        id: 21,
        name: 'Glacier',
        temperature: 'frosty',
        precipitation: 'any',
        color: '#fafeff',
    },
];

console.log(biomesIDs);
console.log(biomesGrads);
console.log(biomes);

function getHumidityFromPrecipitations(precipitation) {
    let humidity = 9;

    if (precipitation > 0.9) {
        humidity = 0;
    } else if (precipitation > 0.75) {
        humidity = 1;
    } else if (precipitation > 0.6) {
        humidity = 2;
    } else if (precipitation > 0.5) {
        humidity = 3;
    } else if (precipitation > 0.4) {
        humidity = 4;
    } else if (precipitation > 0.3) {
        humidity = 5;
    } else if (precipitation > 0.2) {
        humidity = 6;
    } else if (precipitation > 0.05) {
        humidity = 7;
    } else if (precipitation > 0.02) {
        humidity = 8;
    }

    return humidity;
}

function generateBiomes() {
    let humidity = 0;
    let temperature = 0;
    let temperatureValue = 0;

    if (randomTemperature.checked) {
        const rand = Math.random();
        if (rand > 0.5) {
            temperatureValue = Math.floor(Math.random() * 6) + 7;
        } else if (rand > 0.2) {
            temperatureValue = Math.floor(Math.random() * 10) + 5;
        } else {
            temperatureValue = Math.floor(Math.random() * 20);
        }
        temperatureInput.value = temperatureValue;
        temperatureOutput.value = temperatureValue;
    } else {
        temperatureValue = temperatureInput.value;
    }

    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i].height >= worldState.altitudeOcean) {
            humidity = getHumidityFromPrecipitations(worldState.sites[i].precipitation);
            temperature = Math.floor((worldState.sites[i].height * 100) - ((temperatureValue - 12) / 0.2));
            if (temperature > 99) {
                temperature = 99;
            } else if (temperature < 0) {
                temperature = 0;
            }
            worldState.sites[i].biomeID = biomesIDs[humidity][temperature];
            worldState.sites[i].biomeLabel = biomes[worldState.sites[i].biomeID].name;
            worldState.sites[i].biomeColor = biomesGrads[humidity][temperature];
            worldState.sites[i].temperatureDisplay = Math.floor(temperatureInput.value - ((worldState.sites[i].height - 0.2) * 20));
        }
    }
}

export { biomes };
export { generateBiomes };
