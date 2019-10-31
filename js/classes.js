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
  angle = 0
  size = 5
  maxAnglePerTick = 2

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor( x, y, { color=`#fff`, speed=3 } ) {
    super( x, y )

    this.color = color
    this.speed = speed
  }

  tick() {
    const { x, y, pointToMove, size, maxAnglePerTick, speed } = this

    if (this.pointToMove) if (this.distanceTo( pointToMove ) > size) {
      const angle = Math.atan2( pointToMove.y - y, pointToMove.x - x ) * 180 / Math.PI
      const positiveAngle = angle > 0 ? angle : 360 + angle
      const angleToRotate = clockwiseAngle( this.angle, positiveAngle )

      this.angle += rangedCeilFloor( angleToRotate, maxAnglePerTick, -maxAnglePerTick )
      this.x += Math.cos( this.angle * Math.PI / 180 ) * Math.sqrt( speed * .1 )
      this.y += Math.sin( this.angle * Math.PI / 180 ) * Math.sqrt( speed * .1 )
    } else this.pointToMove = null
  }
}