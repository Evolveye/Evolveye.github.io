#include "defs.hpp"

namespace operations {
  void create( Error & err, string filename, char const ** args, int ** imagedata ) {
    if ( DEBUG )
      cout << " - file creator has been started\n";

    string helper = "";
    int width = -1;
    int height = -1;
    int scale = -1;
    int color = -1;

    fstream image( filename );

    if ( DEBUG )
      cout << " - file existing: " << image.good() << "\n";
    
    if ( !imagedata ) {
      int paramNum = 0;

      if (      !utils::tests::width(  err, width,  *(args +   paramNum) ) );
      else if ( !utils::tests::height( err, height, *(args + ++paramNum) ) );
      else if ( !utils::tests::scale(  err, scale,  *(args + ++paramNum) ) );
      else if ( !utils::tests::color(  err, color,  *(args + ++paramNum), scale ) );

      if ( err.type != NOTHING ) {
        err.paramNum = paramNum + 2;

        if ( *(args + paramNum) ) {
          err.value = *(args + paramNum);
        }

        return;
      }

      if ( image.good() ) {
        err.type = FILE_IS_EXISTING;
        return;
      }
    }
    else if ( !image.good() ) {
      err.type = FILE_IS_NOT_EXISTING;
      return;
    }
    else {
      if ( DEBUG )
        cout << " - creator edit mode\n";

      std::getline( image, helper );
      std::getline( image, helper );

      image >> width >> height >> scale;
    }

    if ( DEBUG )
      cout << " - creating\n";

    image.close();
    image.clear();
    image.open( filename, fstream::out | std::ios::trunc );

    if ( !image.good() ) {
      err.type = CANT_EDIT_FILE;
      return;
    }

    image << "P2";
    image << "\n" << "# " << filename;
    image << "\n" << width << " " << height;
    image << "\n" << scale;


    for ( int h = 0;  h < height;  ++h ) {
      image << "\n";

      for ( int w = 0;  w < width;  ++w )
        image << (imagedata ? imagedata[ h ][ w ] : color) << " ";
    }

    image.close();
  }
}