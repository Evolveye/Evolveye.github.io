#include "./defs.hpp"

int main( int argc, char const * argv[] ) {
  Error err;

  if ( argc < 2 )
    err.type = NO_OPERATION;
  else if ( argc < 3 )
    err.type = NO_FILENAME;
  else {
    string operation( *(argv + 1) );
    string filename = "";

    if ( operation != "stworz" && operation != "rysuj" && operation != "czysc" && operation != "histogram" )
      err.type = BAD_OPERATION;
    else if ( !utils::tests::filename( err, filename, *(argv + 2) ) )
      ;
    else {
      argv += 3;
      argc -= 3;

      if ( DEBUG )
        cout << " - operation: " << operation << ",  filename: " << filename << "\n";

      core( operation, filename, argv, err );
    }
  }

  utils::logError( err );

  return err.type != NOTHING  ?  1  :  0;
}