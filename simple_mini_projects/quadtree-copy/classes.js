import { Point, Rect } from "../../js/classes.js";
export default class Quadtree {
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
  constructor( boundary, pointsOnlyInLeaves=true, capacity=4 ) {
    this.boundary = boundary
    this.pointsOnlyInLeaves = pointsOnlyInLeaves
    this.capacity = capacity
  }

  /**
   * @param {Point} point
   */
  insert( point ) {
    if (!this.boundary.contains( point )) return false

    const { points, capacity, pointsOnlyInLeaves, divided } = this

    if (points.length < capacity && !divided) {
      points.push( point )

      return true
    }
    else {
      if (!divided) this.subdivide()

      return this.northeast.insert( point ) ||
        this.northwest.insert( point ) ||
        this.southeast.insert( point ) ||
        this.southwest.insert( point )
    }
  }

  subdivide() {
    const { x, y, width, height } = this.boundary
    const { capacity, pointsOnlyInLeaves } = this

    const ne = new Rect( x + width / 2, y,              width / 2, height / 2 )
    const nw = new Rect( x,             y,              width / 2, height / 2 )
    const se = new Rect( x + width / 2, y + height / 2, width / 2, height / 2 )
    const sw = new Rect( x,             y + height / 2, width / 2, height / 2 )

    this.northeast = new Quadtree( ne, capacity )
    this.northwest = new Quadtree( nw, capacity )
    this.southeast = new Quadtree( se, capacity )
    this.southwest = new Quadtree( sw, capacity )

    this.divided = true

    if (pointsOnlyInLeaves) {
      this.points.forEach( point => this.insert( point ) )
      this.points = []
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  show( ctx, startX=0, startY=0 ) {
    const { x, y, width, height } = this.boundary

    ctx.strokeStyle = `#000`

    ctx.strokeRect( startX + x, startY + y, width, height )

    if (this.divided) {
      this.northeast.show( ctx, startX, startY )
      this.northwest.show( ctx, startX, startY )
      this.southeast.show( ctx, startX, startY )
      this.southwest.show( ctx, startX, startY )
    }

    ctx.strokeStyle = '#f00'

    this.points.forEach( ({ x, y }) => {
      ctx.beginPath()
      ctx.arc( startX + x, startY + y, 2, 0, Math.PI * 2 )
      ctx.stroke()
    } )
  }

  /**
   * @param {Rect} rect
   */
  query( rect ) {
    /** @type {Point[]} */
    const foundedPoints = []

    if (!this.boundary.intersects( rect )) return foundedPoints

    const { points, divided, northeast, northwest, southeast, southwest } = this

    for (const point of points) if (rect.contains( point )) foundedPoints.push( point )

    if (divided) foundedPoints.push(
        ...northeast.query( rect ),
        ...northwest.query( rect ),
        ...southeast.query( rect ),
        ...southwest.query( rect )
      )

    return foundedPoints
  }

  clear() {
    this.points.splice( 0 )

    if (this.divided) {
      this.northeast = null
      this.northwest = null
      this.southeast = null
      this.southwest = null

      this.divided = false
    }
  }
}