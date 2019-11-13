class Point {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor( x, y ) {
    this.x = x
    this.y = y
  }
}

class Rect {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor( x, y, width, height ) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  /**
   * @param {Point} param0
   */
  contains( { x, y } ) {
    return (
      x > this.x && x < this.x + this.width &&
      y > this.y && y < this.y + this.height
    )
  }
}

class Quadtree {
  /** @type {Quadtree} */
  northeast = null
  /** @type {Quadtree} */
  northwest = null
  /** @type {Quadtree} */
  southeast = null
  /** @type {Quadtree} */
  southwest = null

  points = []
  divided = false

  /**
   * @param {Rect} boundary
   * @param {number} capacity
   */
  constructor( boundary, capacity=4 ) {
    this.boundary = boundary
    this.capacity = capacity
  }

  /**
   * @param {Point} point
   */
  insert( point ) {
    if (!this.boundary.contains( point )) return false

    const { points, capacity } = this

    if (points.length < capacity) {
      points.push( point )
    }
    else {
      if (!this.divided) this.subdivide()

      this.northeast.insert( point )
      this.northwest.insert( point )
      this.southeast.insert( point )
      this.southwest.insert( point )
    }
  }

  subdivide() {
    const { x, y, width, height } = this.boundary
    const { capacity } = this

    const ne = new Rect( x + width / 2, y,              width / 2, height / 2 )
    const nw = new Rect( x,             y,              width / 2, height / 2 )
    const se = new Rect( x + width / 2, y + height / 2, width / 2, height / 2 )
    const sw = new Rect( x,             y + height / 2, width / 2, height / 2 )

    this.northeast = new Quadtree( ne, capacity )
    this.northwest = new Quadtree( nw, capacity )
    this.southeast = new Quadtree( se, capacity )
    this.southwest = new Quadtree( sw, capacity )

    this.divided = true
  }
}