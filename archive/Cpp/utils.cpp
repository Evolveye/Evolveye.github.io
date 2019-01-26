#include "./defs.hpp"

namespace utils {
  namespace /* program consts */ {
    const int WIDTH_MIN = 1;
    const int WIDTH_MAX = 1000;

    const int HEIGHT_MIN = 1;
    const int HEIGHT_MAX = 1000;

    const int SCALE_MIN = 1;
    const int SCALE_MAX = 65536;

    const int BGR_MIN = 0;

    const int MODE_A = 0;
    const int MODE_B = 1;

    const int MIN_RECT_SIDE = 1;
  }

  namespace tests {
    bool number( Error & err, int & num, string number, int min, int max ) {
      int n = 0;

      for ( char c : number ) {
        if ( !isdigit( c ) ) {
          err.type = IS_NOT_A_NUMBER;
          return false;
        }

        n *= 10;
        n += c - '0';
      }

      if ( min > n || n > max ) {
        err.type = WRONG_RANGE;
        return false;
      }
      
      num = n;
      return true;
    }
    bool filename( Error & err, string & fname, string param ) {
      for ( char c : param )
        if ( !isalpha( c ) && c != '.' ) {
          err.type = FILENAME__BAD_FORMAT;
          return false;
        }
      
      if ( param.length() < 5 || param.find( ".pgm", param.length() - 4 ) == -1 ) {
        err.type = FILENAME__NO_PGM;
        return false;
      }

      fname = param;
      return true;
    }
    bool width( Error & err, int & w, char const * param ) {
      if ( !param ) {
        err.type = WIDTH__DOESNT_EXISTS;
        return false;
      }

      bool state = number( err, w, param, WIDTH_MIN, WIDTH_MAX );
      
      if ( err.type == IS_NOT_A_NUMBER )
        err.type = WIDTH__IS_NOT_A_NUMBER;
      else if ( err.type == WRONG_RANGE )
        err.type = WIDTH__WRONG_RANGE;

      return state;
    }
    bool height( Error & err, int & h, char const * param ) {
      if ( !param ) {
        err.type = HEIGHT__DOESNT_EXISTS;
        return false;
      }

      bool state = number( err, h, param, HEIGHT_MIN, HEIGHT_MAX );
      
      if ( err.type == IS_NOT_A_NUMBER )
        err.type = HEIGHT__IS_NOT_A_NUMBER;
      else if ( err.type == WRONG_RANGE )
        err.type = HEIGHT__WRONG_RANGE;

      return state;
    }
    bool scale( Error & err, int & s, char const * param ) {
      if ( !param ) {
        err.type = SCALE__DOESNT_EXISTS;
        return false;
      }
      
      bool state = number( err, s, param, SCALE_MIN, SCALE_MAX );
      
      if ( err.type == IS_NOT_A_NUMBER )
        err.type = SCALE__IS_NOT_A_NUMBER;
      else if ( err.type == WRONG_RANGE )
        err.type = SCALE__WRONG_RANGE;

      return state;
    }
    bool color( Error & err, int & c, char const * param, int scale ) {
      if ( !param ) {
        err.type = COLOR__DOESNT_EXISTS;
        return false;
      }

      bool state = number( err, c, param, BGR_MIN, scale );
      
      if ( err.type == IS_NOT_A_NUMBER )
        err.type = COLOR__IS_NOT_A_NUMBER;
      else if ( err.type == WRONG_RANGE )
        err.type = COLOR__WRONG_RANGE;

      return state;
    }
    bool pos( Error & err, int & p, char const * param, int max ) {
      if ( !param ) {
        err.type = POS__DOESNT_EXISTS;
        return false;
      }
      
      return number( err, p, param, 0, max );
    }
    bool length( Error & err, int & l, char const * param, int width, int height, int x, int y ) {
      if ( !param ) {
        err.type = LENGTH__DOESNT_EXISTS;
        return false;
      }
      
      if ( !number( err, l, param, MIN_RECT_SIDE, width - x ) )
        return false;

      return number( err, l, param, MIN_RECT_SIDE, height - y );
    }
    bool mode( Error & err, int & m, char const * param ) {
      if ( !param ) {
        m = 0;
        return true;
        // err.type = MODE__DOESNT_EXISTS;
        // return false;
      }
      
      bool state = number( err, m, param, SCALE_MIN, SCALE_MAX );
      
      if ( err.type == IS_NOT_A_NUMBER )
        err.type = MODE__IS_NOT_A_NUMBER;
      else if ( err.type == WRONG_RANGE )
        err.type = MODE__WRONG_RANGE;

      return state;
    }
  }

  void logError( Error err ) {
    cout << "\n";

    /* * *
     *  
     *  Sorry but - you know - that's polish program
     *  All the sentences are in polish language
     * 
     */

    if ( err.type != NOTHING )
      cerr << "  WYKRYTO BLAD: \n   ";

    switch ( err.type ) {
      case NOTHING:
        cout << "Wykonano pomyslnie.";
        break;

      case NO_OPERATION:
        cerr << "W pierwszej kolejnosci musisz podac operacje do wykonania (stworz/rysuj/czysc/histogram)!";
        break;
      case BAD_OPERATION:
        cerr << "Podales nieistniejaca operacje! Mozesz wybrac jedynie stworz/rysuj/czysc/histogram!";
        break;
      case NO_FILENAME:
        cerr << "Drugim argumentem musi byc nazwa pliku na ktorym chcesz wykonac akcje!";
        break;
      case CANT_EDIT_FILE:
        cerr << "Nie mozna edytowac podanego pliku!";
        break;
      case FILE_IS_EXISTING:
        cerr << "Plik o podanej nazwie juz istnieje! Nie mozna stworzyc drugiego z taka sama nazwa!";
        break;
      case FILE_IS_NOT_EXISTING:
        cerr << "Plik o podanej nazwie nie istnieje badz nie mozna na nim operowac!";
        break;
      case FILENAME__NO_PGM:
        cerr << "Nazwa pliku musi konczyc sie rozszerzeniem \".pgm\"!";
        break;

      case IS_NOT_A_NUMBER:
        cerr << "Twoje argumenty musza byc liczbami naturalnymi!";
        break;
      case WIDTH__IS_NOT_A_NUMBER:
        cerr << "Podałes szerokosc, ktora nie jest liczba naturalna!";
        break;
      case HEIGHT__IS_NOT_A_NUMBER:
        cerr << "Podałes wysokosc, ktora nie jest liczba naturalna!";
        break;
      case SCALE__IS_NOT_A_NUMBER:
        cerr << "Podałes skale, ktora nie jest liczba naturalna!";
        break;
      case COLOR__IS_NOT_A_NUMBER:
        cerr << "Podałes kolor, ktory nie jest liczba naturalna!";
        break;
      case MODE__IS_NOT_A_NUMBER:
        cerr << "Podany tryb rysowania, nie jest liczba naturalna!";
        break;

      case WRONG_RANGE:
        cerr << "Chcesz rysowac poza obrazkiem!";
        break;
      case WIDTH__WRONG_RANGE:
        cerr << "Szerokosc musi miescic sie w zakresie od " << WIDTH_MIN << " do " << WIDTH_MAX << "!";
        break;
      case HEIGHT__WRONG_RANGE:
        cerr << "Wysokosc musi miescic sie w zakresie od " << HEIGHT_MIN << " do " << HEIGHT_MAX << "!";
        break;
      case SCALE__WRONG_RANGE:
        cerr << "Skala musi miescic sie w zakresie od " << SCALE_MIN << " do " << SCALE_MAX << "!";
        break;
      case MODE__WRONG_RANGE:
        cerr << "Tryb moze wynosic " << MODE_A << " lub " << MODE_B << "!";
        break;
      case COLOR__WRONG_RANGE:
        cerr << "Twoj kolor nie miesci sie w dostepnej skali!";
        break;

      case WIDTH__DOESNT_EXISTS:
        cerr << "Nie podales szerokosci grafiki!";
        break;
      case HEIGHT__DOESNT_EXISTS:
        cerr << "Nie podales wysokosci grafiki!";
        break;
      case SCALE__DOESNT_EXISTS:
        cerr << "Nie podales skali!";
        break;
      case COLOR__DOESNT_EXISTS:
        cerr << "Nie podales koloru!";
        break;
      case POSX__DOESNT_EXISTS:
        cerr << "Podaj koordynat X rysowania!";
        break;
      case POSY__DOESNT_EXISTS:
        cerr << "Podaj koordynat Y rysowania!";
        break;
      case LENGTH__DOESNT_EXISTS:
        cerr << "Podaj dlugosc kwadratu ktory ma zostac narysowany!";
        break;
      case MODE__DOESNT_EXISTS:
        cerr << "Podaj tryb rysowania (1/2)!";
        break;

      case FILENAME__BAD_FORMAT:
        cerr << "Nazwa pliku moze sie skladac jedynie z liter!";
        break;
      case WIDTH__BAD_FORMAT:
        cerr << "Szerokosc grafiki musi byc liczba!";
        break;
      case HEIGHT__BAD_FORMAT:
        cerr << "Wysokosc grafiki musi byc liczba!";
        break;
      case SCALE__BAD_FORMAT:
        cerr << "Skala kolorow grafiki musi byc liczba!";
        break;
      case COLOR__BAD_FORMAT:
        cerr << "Kolor grafiki musi byc liczba naturalna!";
        break;

      default:
        cerr << "Wywolano jakis nieznany blad :thinking: (" << err.type << ")";
    }

    if ( err.type != NOTHING ) {
      if ( err.paramNum != 0 )
        cerr << "\n     | Numer parametru: " << err.paramNum;
      if ( err.value != "" )
        cerr << "\n     | Wartosc: " << err.value;
    }

    cout << "\n";
  }
}