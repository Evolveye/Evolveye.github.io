package com.company;

import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.regex.Pattern;

interface MenuLambda {
    void MenuLambda();
}

public class Utils {
    private static boolean running = true;
    private static Scanner input = new Scanner( System.in );
    private static ArrayList<String> menuTitles = new ArrayList<>();
    private static ArrayList<MenuLambda> menuLambdas = new ArrayList<>();

    public static double getDouble() {
        String d;

        d = input.next();

        while (!isDouble( d )) {
            System.out.print( "Niepoprawny format liczby! Wpisz jeszcze raz: " );
            d = input.next();
        }

        return Double.parseDouble( d );
    }
    public static int getInt() {
        String d;

        d = input.next();

        while (!isInt( d )) {
            System.out.print( "Niepoprawny format liczby! Wpisz jeszcze raz: " );
            d = input.next();
        }

        return Integer.parseInt( d );
    }

    private static boolean isDouble( String string ) {
        try {
            Double.parseDouble( string );
            return true;
        }
        catch( Exception e ) {
            return false;
        }
    }
    private static boolean isInt( String string ) {
        try {
            Integer.parseInt( string );
            return true;
        }
        catch( Exception e ) {
            return false;
        }
    }

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

        System.out.print( "# Co chcesz zrobić?" );

        for (String menuTitle : menuTitles) {
            optionsIndices[ index - 1 ] = "" + index;

            System.out.print( "\n# [ " + index++ + " ]: " + menuTitle );
        }

        System.out.print( "\n# > Twój wybór: " );
        String response = input.nextLine();

        while (!goodResponse( response, optionsIndices )) {
            System.out.print( "Podałeś niepoprawną odpowiedź. Ponów wybór: " );
            response = input.nextLine();
        }

        menuLambdas.get( Integer.parseInt( response ) - 1 ).MenuLambda();
    }
    public static void startMenuLoop() {
        do {
            Utils.generateMenu();
        } while( running );
    }
    public static void endMenuLoop() {
        running = false;
    }

    public static String waitForResponse( String title ) {
        System.out.print( title );
        String response = input.nextLine();

        return response;
    }
    public static String waitForResponse( String title, String... responses ) {
        System.out.print( title + " [" + String.join( "/", responses ) + "]: " );
        String response = input.nextLine();

        while (!goodResponse( response, responses )) {
            System.out.print( "Podałeś niepoprawną odpowiedź. Odpowiedz jeszcze raz. [" + String.join( "/", responses ) + "]:" );
            response = input.nextLine();
        }

        return response;
    }
    public static String waitForResponse( String title, Pattern pattern ) {
        System.out.print( title + " [ Wzór: " + pattern + "]: " );
        String response = input.nextLine();

        while (!pattern.matcher( response ).matches()) {
            System.out.print( "Podałeś niepoprawną odpowiedź. Odpowiedz jeszcze raz. [ Wzór: " + pattern + "]: " );
            response = input.nextLine();
        }

        return response;
    }

    public static boolean goodResponse( String response, String... responses ) {
        for ( String res : responses )
            if (res.equals( response )) return true;

        return false;
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
}