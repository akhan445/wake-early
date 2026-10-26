// Randomized depth-first search: carves a perfect maze (exactly one path between any two cells).
export const DIFFICULTY = { easy: 6, medium: 10, hard: 14 }

const DIRS = [
  { key: 'n', dr: -1, dc: 0, opposite: 's' },
  { key: 's', dr: 1, dc: 0, opposite: 'n' },
  { key: 'e', dr: 0, dc: 1, opposite: 'w' },
  { key: 'w', dr: 0, dc: -1, opposite: 'e' },
]

export function generateMaze(size) {
  const cells = Array.from({ length: size * size }, () => ({ n: true, s: true, e: true, w: true, seen: false }))
  const at = (r, c) => cells[r * size + c]
  const stack = [[0, 0]]
  at(0, 0).seen = true
  while (stack.length) {
    const [r, c] = stack[stack.length - 1]
    const options = DIRS.filter(({ dr, dc }) => {
      const nr = r + dr, nc = c + dc
      return nr >= 0 && nr < size && nc >= 0 && nc < size && !at(nr, nc).seen
    })
    if (!options.length) {
      stack.pop()
      continue
    }
    const d = options[Math.floor(Math.random() * options.length)]
    const nr = r + d.dr, nc = c + d.dc
    at(r, c)[d.key] = false
    at(nr, nc)[d.opposite] = false
    at(nr, nc).seen = true
    stack.push([nr, nc])
  }
  return { size, cells }
}

// Can you step from cell a to neighbouring cell b without crossing a wall?
export function canMove(maze, [r, c], [nr, nc]) {
  const d = DIRS.find(({ dr, dc }) => r + dr === nr && c + dc === nc)
  return Boolean(d) && !maze.cells[r * maze.size + c][d.key]
}
