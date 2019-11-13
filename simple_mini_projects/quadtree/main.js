const width = 500
const height = 500
const points = 5
const qtree = new Quadtree( new Rect( 0, 0, width, height ) )

for (let i = 0; i < points; i++) {
  const point = new Point( random( width ), random( height ) )

  qtree.insert( point )
}