class Point {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor( x, y, integers=false ) {
    this.x = integers ? Math.floor( x ) : x
    this.y = integers ? Math.floor( y ) : y
  }
}