#include "defs.hpp"

namespace operations {
  int * histogramStats( Error & err, string filename ) {
    string helper;
    int width = -1;
    int height = -1;
    int scale = -1;

    fstream file( filename, fstream::in );

    std::getline( file, helper );
    std::getline( file, helper );

    file >> width >> height >> scale;

    int * stats = new int[ scale + 1 ];

    if ( DEBUG )
      cout << " - histogram stats creating\n";

    for ( int statsFiller = scale;  statsFiller >= 0;  --statsFiller )
      stats[ statsFiller ] = 0;

    for ( int pixel = width * height -1;  pixel >= 0;  --pixel ) {
      int color = 0;

      file >> color;

      ++stats[ color ];
    }

    file.close();

    if ( DEBUG )
      cout << " - stats created\n";

    return stats;
  }
  void histogram( Error & err, string filename, int scale ) {
    if ( DEBUG )
      cout << " - histogram started\n";

    int * stats = histogramStats( err, filename );

    if ( DEBUG )
      cout << " - delimiter creating\n";

    int delimiter = 1;
    int labelLength = 10;
    bool grouping = false;


    for ( int color = scale;  color >= 0;  --color ) {
      int mod = stats[ color ] / 50;

      if ( mod > delimiter )
        delimiter = mod;
    }

    cout << "\n\n  Aby slupki nie byly zbyt duze, wszystkie zostaly podzielone przez " << " " << delimiter << "\n\n";

    string label = "";
    for ( int color = scale, groupingHelper = 0;  color >= 0;  --color ) {
      if ( stats[ color ] == 0 && stats[ color - 1 ] == 0 && color != 1 && grouping ) {
        if ( !groupingHelper )
          groupingHelper = color;

        continue;
      }
      else if ( groupingHelper ) {
        label = std::to_string( groupingHelper ) + "-" + std::to_string( color );
        for ( int labelPretter = labelLength - label.length();  labelPretter; --labelPretter )
          cout << ' ';
        cout << label << " | (0)\n";

        groupingHelper = 0;
        continue;
      }

      label = std::to_string( color );
      for ( int labelPretter = labelLength - label.length();  labelPretter; --labelPretter )
        cout << ' ';
      cout << label + " |";

      for ( int points = std::ceil( stats[ color ] / delimiter );  points;  --points )
        cout << '#';

      cout << " (" << stats[ color ] << ")\n";
    }
    cout << '\n';

    delete [] stats;
  }
}