export default {
  onResize() {},

  /**
   * @param {object} param0
   * @param {number} param0.x
   * @param {number} param0.y
   */
  onMouseMove( { x, y } ) {},

  /**
   * @param {object} param0
   * @param {number} param0.x
   * @param {number} param0.y
   */
  onMouseDown( { x, y } ) {},

  /**
   * @param {object} param0
   * @param {number} param0.x
   * @param {number} param0.y
   */
  onMouseUp( { x, y } ) {},

  /**
   * @param {object} param0
   * @param {number} param0.x
   * @param {number} param0.y
   */
  onClick( { x, y } ) {
    console.log( 11 )
  },

  draw() {}
}