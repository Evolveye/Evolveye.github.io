#ifndef DEFS
#define DEFS

#include <iostream>
#include <cstring>
#include <fstream>
#include <string>
#include <cmath>

using std::fstream;
using std::string;
using std::cout;
using std::cerr;

const bool DEBUG = false;

enum ErrorType {
  NOTHING,

  NO_OPERATION,
  BAD_OPERATION,
  NO_FILENAME,
  CANT_EDIT_FILE,
  FILE_IS_EXISTING,
  FILE_IS_NOT_EXISTING,
  FILENAME__NO_PGM,

  IS_NOT_A_NUMBER,
  WIDTH__IS_NOT_A_NUMBER,
  HEIGHT__IS_NOT_A_NUMBER,
  SCALE__IS_NOT_A_NUMBER,
  COLOR__IS_NOT_A_NUMBER,
  MODE__IS_NOT_A_NUMBER,

  WRONG_RANGE,
  WIDTH__WRONG_RANGE,
  HEIGHT__WRONG_RANGE,
  SCALE__WRONG_RANGE,
  COLOR__WRONG_RANGE,
  MODE__WRONG_RANGE,

  FILENAME__BAD_FORMAT,
  WIDTH__BAD_FORMAT,
  HEIGHT__BAD_FORMAT,
  COLOR__BAD_FORMAT,
  SCALE__BAD_FORMAT,

  WIDTH__DOESNT_EXISTS,
  HEIGHT__DOESNT_EXISTS,
  POS__DOESNT_EXISTS,
  LENGTH__DOESNT_EXISTS,
  COLOR__DOESNT_EXISTS,
  SCALE__DOESNT_EXISTS,
  POSX__DOESNT_EXISTS,
  POSY__DOESNT_EXISTS,
  MODE__DOESNT_EXISTS
};

struct Error {
  int paramNum;
  string value;
  ErrorType type;
  Error(): paramNum( 0 ), value( "" ), type( NOTHING ) {}
};

namespace utils {
  namespace tests {
    bool number( Error & err, int & num, string number, int min, int max );
    bool filename( Error & err, string & fname, string param );
    bool width( Error & err, int & w, char const * param );
    bool height( Error & err, int & h, char const * param );
    bool scale( Error & err, int & s, char const * param );
    bool color( Error & err, int & c, char const * param, int scale );
    bool pos( Error & err, int & p, char const * param, int max );
    bool length( Error & err, int & l, char const * param, int width, int height, int x, int y );
    bool mode( Error & err, int & m, char const * param );
  }

  void logError( Error err );
}

namespace operations {
  int * histogramStats( Error & err, string filename );
  void histogram( Error & err, string filename, int scale );
  void edit( Error & err, char const * args[], int ** imagedata, string filename, int width, int height, int scale );
  void create( Error & err, string filename, char const ** args, int ** imagedata=nullptr );
}

void removeArr( int ** arr, int size );
void core( string operation, string filename, char const * args[], Error err);

#endif