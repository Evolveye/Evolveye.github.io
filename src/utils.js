export const random = (min, max) => Math.floor( Math.random() * (max - min + 1) ) + min

export class Point {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor( x, y ) {
    this.x = x
    this.y = y
  }

  /**
   * @param {number} x
   */
  set newX( x ) {
    this.x = this.alwaysInteger ? x | 1 : x
  }
  /**
   * @param {number} y
   */
  set newY( y ) {
    this.y = this.alwaysInteger ? y | 1 : y
  }

  /** Get distance to point
   * @param {Point} param0
   */
  distanceTo({ x, y }) {
    return Math.sqrt( (this.x - x) ** 2 + (this.y - y) ** 2 )
  }
  /**
   * @param {Point} point
   */
  equal( { x, y } ) {
    return this.x === x && this.y === y
  }
}
export class MovingCircle extends Point {
  /** @type {Point} */
  pointToMove = null
  angle = 0
  maxAnglePerTick = 2

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor( x, y, { color=`#fff`, speed=3, size=5 } ) {
    super( x, y )

    this.color = color
    this.speed = speed
    this.size = size
  }

  tick() {
    const { x, y, pointToMove, size, maxAnglePerTick, speed } = this

    if (this.pointToMove) if (this.distanceTo( pointToMove ) > size) {
      const angle = Math.atan2( pointToMove.y - y, pointToMove.x - x ) * 180 / Math.PI
      const positiveAngle = angle > 0 ? angle : 360 + angle
      const angleToRotate = MovingCircle.clockwiseAngle( this.angle, positiveAngle )

      this.angle += MovingCircle.rangedCeilFloor( angleToRotate, maxAnglePerTick, -maxAnglePerTick )
      this.x += Math.cos( this.angle * Math.PI / 180 ) * Math.sqrt( speed * .1 )
      this.y += Math.sin( this.angle * Math.PI / 180 ) * Math.sqrt( speed * .1 )
    } else this.pointToMove = null
  }


  static clockwiseAngle( angleA, angleB ) {
    let biggerAngle, smallerAngle, sign

    if (angleA > angleB) {
      biggerAngle = angleA
      smallerAngle = angleB
      sign = 1
    } else {
      biggerAngle = angleB
      smallerAngle = angleA
      sign = -1
    }

    const clockwiseMove = biggerAngle - smallerAngle
    const anticlockwiseMove = smallerAngle + 360 - biggerAngle

    if (anticlockwiseMove < clockwiseMove) return anticlockwiseMove * sign
    else return clockwiseMove * -sign
  }
  static rangedCeilFloor( num, max, min=0 ) {
    return num < min ? min
      : num > max ? max
      : num
  }
}