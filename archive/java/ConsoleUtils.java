package com.company;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Scanner;

interface MenuLambda {
    void MenuLambda();
}

public class ConsoleUtils {
    private static boolean running = true;
    private static ArrayList<String> menuTitles = new ArrayList<>();
    private static ArrayList<MenuLambda> menuLambdas = new ArrayList<>();

    public static void printInfo() {
        System.out.println( " |" );
        System.out.println( " | Ten zaawansowany program potrafi liczyć pieniądze!" );
        System.out.println( " | Program jest w stanie:" );
        System.out.println( " |  - pokazać ile miesięcy musisz oszczędzać do wymarzonej kwoty" );
        System.out.println( " |  - przedstawić comiesięczne kwoty" );
        System.out.println( " |  - wyświetlić Twój wiek, po osiągnięciu celowej kwoty" );
        System.out.println( " |\n" );
    }

    public static void addMenuItem( String title, MenuLambda menuLambda ) {
        menuTitles.add( title );
        menuLambdas.add( menuLambda );
    }
    public static void generateMenu() {
        int index = 1;
        String[] optionsIndices = new String[ menuTitles.size() ];

        System.out.print( "\n | Co chcesz zrobić?" );

        for (String menuTitle : menuTitles) {
            optionsIndices[ index - 1 ] = "" + index;

            System.out.print( "\n [ " + index++ + " ]: " + menuTitle );
        }

        System.out.print( "\n |> Twój wybór: " );
        String response = ConsoleInputUtils.readLine();

        while (!ConsoleInputUtils.isGoodResponse( response, optionsIndices )) {
            System.out.print( " |> Niepoprawną odpowiedź. Ponów wybór: " );
            response = ConsoleInputUtils.readLine();
        }

        menuLambdas.get( Integer.parseInt( response ) - 1 ).MenuLambda();
    }
    public static void startMenuLoop() {
        do {
            ConsoleUtils.generateMenu();
        } while( running );
    }
    public static void endMenuLoop() {
        running = false;
    }

    public static boolean goodTimes(LocalDateTime startDate, LocalDateTime endDate ) {
        int hoursStart = startDate.getHour();
        int hoursEnd = endDate.getHour();

        int minutesStart = startDate.getMinute();
        int minutesEnd = endDate.getMinute();

        if (hoursStart > hoursEnd || hoursStart == hoursEnd && minutesStart >= minutesEnd) return false;

        return true;
    }
    public static String getTime( LocalDateTime date ) {
        String h = "" + date.getHour();
        String m = "" + date.getMinute();
        String s = "" + date.getSecond();

        if (h.length() == 1) h = "0" + h;
        if (m.length() == 1) m = "0" + m;
        if (s.length() == 1) s = "0" + s;

        return h + ":" + m; // + ":" + s;
    }

    public static String padStarString( String str, int length, char character ) {
        for (int i = str.length(); i < length; i++ ) {
            str = character + str;
        }

        return str;
    }
    public static String padEndString( String str, int length, char character ) {
        for (int i = str.length(); i < length; i++ ) {
            str += character;
        }

        return str;
    }
}