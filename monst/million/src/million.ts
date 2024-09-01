// 定義撲克牌的花色和數值
class Deck {
  static readonly suits = ['♠️', '♥️', '♦️', '♣️'];
  static readonly ranks = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];

  static create(): Card[] {
    const deck = [];
    for (let i = 0; i < Deck.suits.length; i++) {
      for (let j = 0; j < Deck.ranks.length; j++) {
        deck.push(new Card(/** suit: */ i, /** rank: */ j));
      }
    }
    return deck;
  }
}

interface Card {
  /** index of suit */
  suit: number;
  /** index of rank */
  rank: number;
}

class Card implements Card {
  constructor(suit: number, rank: number) {
    this.suit = suit;
    this.rank = rank;
  }
  toString() {
    return `${Deck.suits[this.suit]}${Deck.ranks[this.rank]}`;
  }
}

// 創建一副撲克牌
const deck = Deck.create();

// 在遊戲板上顯示撲克牌
function displayDeck() {
  const gameBoard = document.querySelector<HTMLTableElement>('#game-board')!;
  gameBoard.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 13; j++) {
      const cell = document.createElement('td');
      const idx = i * 13 + j;
      cell.setAttribute('data-deck-index', idx.toString());
      cell.textContent = deck[i * 13 + j].toString();
      cell.addEventListener('click', handleCardClick);
      row.appendChild(cell);
    }
    gameBoard.appendChild(row);
  }
}

interface GameHistory {
  selectedCard: Card | null;
  high: number;
  low: number;
  draw: number;
}

// 處理玩家點擊牌的事件
let selectedCard: Card | null = null;
let remainingCards = [...deck];
let clickCount = 0;
let gameHistory: GameHistory[] = [];

function handleCardClick(event: MouseEvent) {
  const selectedCell = event.target as HTMLTableCellElement;
  const deckIndex = Number.parseInt(
    selectedCell.getAttribute('data-deck-index') || ''
  );
  const lastone = selectedCard;
  selectedCard = deck[deckIndex];
  remainingCards = remainingCards.filter((card) => card != selectedCard);
  // 跟前一次比不一樣才紀錄次數
  if (lastone?.rank !== selectedCard.rank) {
    console.log(`count++ ${selectedCard.toString()}`);
    clickCount++;
  }

  let high = 0,
    low = 0,
    draw = 0;
  for (const card of remainingCards) {
    const rank = card.rank;
    const selectedRank = selectedCard.rank;
    if (rank > selectedRank) {
      high++;
    } else if (rank < selectedRank) {
      low++;
    } else {
      draw++;
    }
  }

  gameHistory.push({
    selectedCard,
    high,
    low,
    draw,
  });

  prependHistory(gameHistory[gameHistory.length - 1]);

  selectedCell.classList.toggle('selected');

  if (clickCount === 10) {
    selectedCell.classList.toggle('finished', /**force */ true);
    prependHistory('遊戲結束!');
  }
}

// 重置遊戲
function resetGame() {
  selectedCard = null;
  remainingCards = [...deck];
  clickCount = 0;
  gameHistory = [];
  const list = document.querySelector<HTMLUListElement>('#history')!;
  list.innerHTML = '';
  displayDeck();
}

// 添加重置按鈕
const resetButton = document.querySelector<HTMLButtonElement>('button')!;
resetButton.onclick = () => resetGame();

function createHistoryItem(move: GameHistory | string): HTMLLIElement {
  if (typeof move !== 'string') {
    const total = move.high + move.low;
    const rateH = Math.round((move.high / total) * 100);
    const rateL = Math.round((move.low / total) * 100);
    const data = [];
    data.push(`${move.selectedCard}`);
    data.push(
      rateH >= rateL
        ? `<b class='high' style='opacity: ${rateH / 100};'>HIGH: ${move.high} (${rateH}%)</b>`
        : `HIGH: ${move.high} (${rateH}%)`
    );
    data.push(
      rateL >= rateH
        ? `<b class='low' style='opacity: ${rateL / 100};'>LOW: ${move.low} (${rateL}%)</b>`
        : `LOW: ${move.low} (${rateL}%)`
    );
    data.push(`DRAW: ${move.draw}`);
    // move = `${move.selectedCard}, HIGH: ${move.high} (${rateH}%), LOW: ${move.low} (${rateL}%), DRAW: ${move.draw}`;
    move = data.join(', ');
  }
  const el = document.createElement('li');
  el.innerHTML = move;
  return el;
}

function prependHistory(history: GameHistory | string): void {
  const list = document.querySelector<HTMLUListElement>('#history')!;
  list.prepend(createHistoryItem(history));
}

// 初始化遊戲
displayDeck();
