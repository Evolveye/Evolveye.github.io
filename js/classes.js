class Point {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor( x, y ) {
    this.x = x
    this.y = y
  }
  /** Get distance to point
   * @param {Point} param0
   */
  distanceTo({ x, y }) {
    return Math.sqrt( (this.x - x) ** 2 + (this.y - y) ** 2 )
  }
}

class MovingCircle extends Point {
  /** @type {Point} */
  pointToMove = null

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor( x, y ) {
    super( x, y )

    this.speed = 5
  }
}