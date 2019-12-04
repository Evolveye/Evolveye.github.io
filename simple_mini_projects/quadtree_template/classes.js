class Point {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor( x, y, alwaysInteger=false ) {
    this.x = alwaysInteger ? x | 1 : x
    this.y = alwaysInteger ? y | 1 : y
    this.alwaysInteger = alwaysInteger
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

  /**
   * @param {Point} point
   */
  equal( { x, y } ) {
    return this.x == x && this.y == y
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
      x >= this.x && x <= this.x + this.width &&
      y >= this.y && y <= this.y + this.height
    )
  }

  intersects( { x, y, width, height } ) {
    return !(
      x > this.x + this.width ||
      x + width < this.x ||
      y > this.y + this.height ||
      y + height < this.y
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

  references = []
  divided = false

  /**
   * @param {Rect} boundary
   * @param {number} resolution
   */
  constructor( boundary, approximateResolution=2 ) {
    this.boundary = boundary
    this.maxDeph = Math.round( Math.log2( 500 / approximateResolution ) )
    this.resolution = 500 / (2 ** this.maxDeph)
  }

  /**
   * @param {Point[]} vertices
   */
  insertPolygon( object, ...vertices ) {
    if (!vertices.length < 3) return

    this.insertPointSequence( object, vertices )

    const point1 = vertices[ 0 ]
    const point2 = vertices[ 1 ]
    const pointNearFirstLine = new Point(
      point1.x + (point2.x - point1.x) / 2 + (point1.y != point2.y ? this.resolution : 0),
      point1.y + (point2.y - point1.y) / 2 + (point1.y == point2.y ? this.resolution : 0),
    )

    const maxX = Math.max( ...vertices.map( v => v.x ) )
    const rect = new Rect( Math.min( x1, x2 ), Math.min( y1, y2 ), Math.abs( x2 - x1 ), Math.abs( y2 - y1 ) )

    // find all leaves on line between pointNearFirstLine.x and maxX

    // next steps...
  }

  /**
   * @param {Point[]} points
   */
  insertPointSequence( object, ...points ) {
    if (!points.length) return

    if (points.length == 1) this.insert( object, point )
    else for (let i = 1; i < points.length; i++) {
      const pointA = points[ i - 1 ]
      const pointB = points[ i     ]

      Quadtree.bresenham( pointA, pointB, this.resolution ).forEach( point => this.insert( object, point ) )
    }
  }

  /**
   * @param {Point} point
   */
  insert( object, point ) {
    if (!this.boundary.contains( point )) return false

    const { references, divided, boundary, resolution } = this

    if (boundary.width == resolution) {
      references.push( object )

      return true
    }
    else {
      if (!divided) this.subdivide()

      return this.northeast.insert( object, point )
        || this.northwest.insert( object, point )
        || this.southeast.insert( object, point )
        || this.southwest.insert( object, point )
    }
  }

  subdivide() {
    const { x, y, width, height } = this.boundary
    const { resolution } = this

    const ne = new Rect( x + width / 2, y,              width / 2, height / 2 )
    const nw = new Rect( x,             y,              width / 2, height / 2 )
    const se = new Rect( x + width / 2, y + height / 2, width / 2, height / 2 )
    const sw = new Rect( x,             y + height / 2, width / 2, height / 2 )

    this.northeast = new Quadtree( ne, resolution )
    this.northwest = new Quadtree( nw, resolution )
    this.southeast = new Quadtree( se, resolution )
    this.southwest = new Quadtree( sw, resolution )

    this.divided = true

    this.references.forEach( point => this.insert( point ) )
    this.references = []
  }

  /**
   * @param {Rect} rect
   */
  queryLeaves( rect ) {
    /** @type {Quadtree[]} */
    const foundedLeaves = []
    const { boundary } = this

    if (!this.boundary.intersects( rect )) return foundedLeaves

    const { divided, northeast, northwest, southeast, southwest, resolution } = this

    if (rect.intersects( new Rect( boundary.x, boundary.y, resolution, resolution ) )) foundedLeaves.push( this )

    if (divided) foundedLeaves.push(
      ...northeast.query( rect ),
      ...northwest.query( rect ),
      ...southeast.query( rect ),
      ...southwest.query( rect ),
    )

    return foundedLeaves
  }

  query( rect ) {
    return this.queryLeaves( rect )
      .map( qTree => qTree.references )
      .filter( (reference, i, arr) => arr.indexOf( reference ) === i )
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  show( ctx, { meshShowing=true, drawAreaX=0, drawAreaY=0 } ) {
    const { x, y, width, height } = this.boundary
    const { resolution, references: points } = this

    ctx.strokeStyle = `#000`

    if (meshShowing) ctx.strokeRect( drawAreaX + x, drawAreaY + y, width, height )

    if (this.divided) {
      this.northeast.show( ctx, { meshShowing, drawAreaX, drawAreaY } )
      this.northwest.show( ctx, { meshShowing, drawAreaX, drawAreaY } )
      this.southeast.show( ctx, { meshShowing, drawAreaX, drawAreaY } )
      this.southwest.show( ctx, { meshShowing, drawAreaX, drawAreaY } )
    }

    ctx.fillStyle = '#f00'

    if (points.length) ctx.fillRect( drawAreaX + x, drawAreaY + y, resolution, resolution )
  }

  clear() {
    this.references.splice( 0 )

    if (this.divided) {
      this.northeast = null
      this.northwest = null
      this.southeast = null
      this.southwest = null

      this.divided = false
    }
  }

  static bresenham( { x:xA, y:yA }, { x:xB, y:yB }, resolution=1 ) {
    const coordinates = []

    let x1 = this.floorToDivisible( xA, resolution )
    let y1 = this.floorToDivisible( yA, resolution )
    const x2 = this.floorToDivisible( xB, resolution )
    const y2 = this.floorToDivisible( yB, resolution )

    const deltaX = Math.abs( x1 - x2 )
    const deltaY = Math.abs( y1 - y2 )

    const stepX = (x1 < x2 ? 1 : -1) * resolution
    const stepY = (y1 < y2 ? 1 : -1) * resolution

    let err = deltaX - deltaY

    do  {
      coordinates.push( new Point( x1 + resolution / 2, y1 + resolution / 2 ) )

      const doubledErr = err * 2

      if (doubledErr > -deltaY) {
        err -= deltaY
        x1 += stepX
      }
      if (doubledErr < deltaX) {
        err += deltaX
        y1 += stepY
      }
    } while (x1 != x2 || y1 != y2)

    coordinates.push( new Point( x1 + resolution / 2, y1 + resolution / 2 ) )

    return coordinates
  }

  static floorToDivisible( number, divider ) {
    return Math.floor( number / divider ) * divider
  }
}