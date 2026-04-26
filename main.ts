//　実行コマンド
// npx tsc main.ts
// node main.js
type Pos = { x: number; y: number };

type Enemy = {
    x: number;
    y: number;
    dir: Dir;
    step: number;
};

type Dir = 'u' | 'd' | 'l' | 'r' | 'w';

type EntityType = "S" | "A" | "B" | "C" | "D" | "E" | "G" | "o";

type Direction = { name: 'u' | 'd' | 'l' | 'r'; dx: number; dy: number };

const playerMoves: Direction[] = [
    { name: "u", dx: 0, dy: 1 },
    { name: "d", dx: 0, dy: -1 },
    { name: "l", dx: 1, dy: 0 },
    { name: "r", dx: -1, dy: 0 }
]

const directionTable: Record<string, Direction[]> = {
    A: [
        { name: "d", dx: 0, dy: -1 },
        { name: "l", dx: 1, dy: 0 },
        { name: "u", dx: 0, dy: 1 },
        { name: "r", dx: -1, dy: 0 },
    ],
    B: [
        { name: "u", dx: 0, dy: 1 },
        { name: "l", dx: 1, dy: 0 },
        { name: "d", dx: 0, dy: -1 },
        { name: "r", dx: -1, dy: 0 },
    ],
};

const map = `
###########
#o  A#B  G#
# ##   ## #
# # o#o   #
# # ### # #
#S  Co   o#
###########
`.trim();

const field: string[][] = map
    .split("\n")
    .reverse()
    .map(line => line.split(""));

const stage: string[][] = field.map(row =>
    row.map(c => (c === "#" || c === " " ? c : " "))
);

const entities: Record<EntityType, Pos[]> = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    G: [],
    o: [],
};

// プレイヤー・敵・ゴール・アイテムの場所を格納
for (let y = 0; y < field.length; y++) {
    const row = field[y];

    for (let x = 0; x < row.length; x++) {
        const c = row[x];

        if (c === "#" || c === " ") continue;

        entities[c as EntityType].push({ x, y });
    }
}

// const enemiesC: Enemy[] = entities.C.map(pos => ({
//     x: pos.x,
//     y: pos.y,
//     dir: "u",
//     step: 0,
// }));

// const enemiesD: Enemy[] = entities.D.map(pos => ({
//     x: pos.x,
//     y: pos.y,
//     dir: "u",
//     step: 0,
// }));


// 上下左右に移動する場合の動き方の定義
function moveEnemy(type: string, pos: Pos, grid: string[][]): Pos {
    const dirs = directionTable[type];

    for (const dir of dirs) {
        const nx = pos.x + dir.dx;
        const ny = pos.y + dir.dy;

        if (grid[ny]?.[nx] === " ") {
            return {
                x: nx,
                y: ny,
            };
        }
    }
    return pos;
}

function movementA(current: Pos, stage: string[][]) {
    const player = entities.S[0];

    if (player.y !== 1 && stage[current.y + 1][current.x] === ' ') {
        return { x: current.x, y: current.y + 1 };
    } else if (player.x !== 1 && stage[current.y][current.x + 1] === ' ') {
        return { x: current.x + 1, y: current.y };
    } else {
        const nextMove = moveEnemy("A", current, stage);
        return nextMove;
    }
}

function movementB(current: Pos, stage: string[][]) {
    const player = entities.S[0];

    if (player.x !== 1 && stage[current.y][current.x + 1] === ' ') {
        return { x: current.x + 1, y: current.y };
    } else if (player.y !== 1 && stage[current.y + 1][current.x] === ' ') {
        return { x: current.x + 1, y: current.y };
    } else {
        const nextMove = moveEnemy("B", current, stage);
        return nextMove;
    }
}

function simulateEnemyA(t: number) {
    let pos = { ...entities.A[0] };

    for (let i = 0; i < t; i++) {
        pos = movementA(pos, stage);
    }

    return pos;
}

function simulateEnemyB(t: number) {
    let pos = { ...entities.B[0] };

    for (let i = 0; i < t; i++) {
        pos = movementB(pos, stage);
    }

    return pos;
}