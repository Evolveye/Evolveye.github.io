#include "defs.hpp"

void removeArr( int ** arr, int size ) {
  for ( int i = 0;  i < size;  ++i )
    delete [] arr[ i ];
  delete [] arr;
}

void core( string operation, string filename, char const * args[], Error err) {

  int width = -1;
  int height = -1;
  int scale = -1;
  int color = -1;
  string helper = "";

  if ( operation == "stworz" )
    operations::create( err, filename, args );
    
  if ( err.type != NOTHING )
    return utils::logError( err );

  if ( DEBUG )
    cout << " - file opening\n";

  fstream image;
  image.open( filename, fstream::in );

  if ( DEBUG )
    cout << " - file state: " << image.good() << "\n";

  if ( !image.good() ) {
    err.type = FILE_IS_NOT_EXISTING;

    return utils::logError( err );
  }

  std::getline( image, helper );
  std::getline( image, helper );

  image >> width >> height >> scale;
  
  if ( operation == "histogram" ) {
    operations::histogram( err, filename, scale );
    return;
  }
  if ( operation == "czysc" ) {
    utils::tests::color( err, color, *args, scale );

    if ( err.type != NOTHING ) {
      err.paramNum = 2;

      if ( *args )
        err.value = *args;

      return utils::logError( err );
    }
  }

  int ** imagedata = new int * [ height ];

  for ( int i = 0;  i < height;  ++i )
    imagedata[ i ] = new int[ width ];

  if ( DEBUG )
    cout << " - file structure:";

  for ( int y = 0;  y < height;  ++y ) {
    if ( DEBUG && height < 100 && width < 100 )
      cout << "\n    |  ";

    for ( int x = 0;  x < width;  ++x ) {
      if ( operation == "czysc" )
        imagedata[ y ][ x ] = std::stoi( args[ 0 ] );
      else
        image >> imagedata[ y ][ x ];

      if ( DEBUG && height < 100 && width < 100 )
        cout << imagedata[ y ][ x ] << " ";
    }
  }

  image.close();

  if ( DEBUG )
    cout << "\n";

  if ( operation == "rysuj" )
    operations::edit( err, args, imagedata, filename, width, height, scale );

  if ( err.type != NOTHING )
    utils::logError( err );
  else if ( operation == "rysuj" || operation == "czysc" )
    operations::create( err, filename, nullptr, imagedata );
  if ( err.type != NOTHING )
    utils::logError( err );

  removeArr( imagedata, height );
}