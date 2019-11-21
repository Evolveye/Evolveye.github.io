package com.company;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.regex.Pattern;

public class Utils {
    private static Scanner input = new Scanner( System.in );

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
    public static int optionFromMenu( String[] options ) {
        ArrayList<String> indices = new ArrayList<>();

        System.out.print( "# Co chcesz zrobić?" );

        for (String option : options) {
            indices.add( "" + indices.size() + 1 );

            System.out.print( "\n# [ " + indices.size() + " ]: " + option );
        }

        System.out.print( "\n# > Twój wybór: " );
        String response = input.nextLine();

        while (!goodResponse( response, indices.toArray( new String[ 0 ] ) )) {
            System.out.print( "Podałeś niepoprawną odpowiedź. Odpowiedz jeszcze raz. [" + String.join( "/", indices ) + "]:" );
            response = input.nextLine();
        }

        return Integer.parseInt( response );
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