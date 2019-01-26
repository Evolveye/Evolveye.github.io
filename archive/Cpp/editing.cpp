#include "defs.hpp"

namespace operations {
  void edit( Error & err, char const * args[], int ** imagedata, string filename, int width, int height, int scale ) {
    if ( DEBUG )
      cout << " - drawing\n";

    int posX = -1;
    int posY = -1;
    int length = -1;
    int color = -1;
    int mode = -1;
    int bgrColor = -1;

    int paramNum = 0;
    if (      !utils::tests::pos(    err, posX,   *(args +   paramNum), width  ) );
    else if ( !utils::tests::pos(    err, posY,   *(args + ++paramNum), height ) );
    else if ( !utils::tests::length( err, length, *(args + ++paramNum), width, height, posX, posY ) );
    else if ( !utils::tests::color(  err, color,  *(args + ++paramNum), scale  ) );
    else if ( !utils::tests::mode(   err, mode,   *(args + ++paramNum) ) );

    if ( err.type != NOTHING ) {
      err.paramNum = paramNum + 2;

      if ( *(args + paramNum) )
        err.value = *(args + paramNum);
      if ( posX == -1 )
        err.type = POSX__DOESNT_EXISTS;
      else if ( posY == -1 )
        err.type = POSY__DOESNT_EXISTS;

      return;
    }

    int * stats = operations::histogramStats( err, filename );

    for ( int color = scale, colorCount = 0;  color >= 0;  --color ) {
      if ( stats[ color ] > colorCount ) {
        colorCount = stats[ color ];
        bgrColor = color;
      }
    }

    delete [] stats;

    if ( DEBUG )
      cout << " - editor bgrColor: " << bgrColor << ",  mode: " << mode << "\n";

    for ( int y = posY;  y < posY + length;  ++y ) {
      for ( int x = posX;  x < posX + length;  ++x )
        if ( mode == 1 && imagedata[ y ][ x ] != bgrColor )
          imagedata[ y ][ x ] = bgrColor;
        else
          imagedata[ y ][ x ] = color;
    }
  }
}