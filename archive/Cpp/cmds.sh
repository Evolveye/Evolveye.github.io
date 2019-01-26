#!/bin/bash

g++ *.cpp -o pgm

./pgm stworz iguana.pgm 1000 500 10 0
./pgm rysuj iguana.pgm 100 100 100 3
./pgm rysuj iguana.pgm 150 150 100 5
./pgm rysuj iguana.pgm 125 125 100 10 1

./pgm stworz igu.pgm 20 30 10 0
./pgm rysuj igu.pgm 1 1 10 3
./pgm rysuj igu.pgm 5 5 10 5
./pgm rysuj igu.pgm 2 2 10 10 1
./pgm rysuj igu.pgm 10 20 10 8
./pgm histogram igu.pgm