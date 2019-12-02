package io.github.evolveye;

import java.util.Scanner;
import java.util.regex.Pattern;

public class InputUtils {
    private static boolean running = true;
    private static Scanner input = new Scanner( System.in );

    public static String readLine() {
        return input.nextLine();
    }

    public static double getDouble( String title ) {
        System.out.print( title + ": " );

        return getDouble();
    }
    public static double getDouble() {
        String d;

        d = input.nextLine();

        while (!isDouble( d )) {
            System.out.print( "Wrong number format. Try again: " );
            d = input.nextLine();
        }

        return Double.parseDouble( d );
    }

    public static double getInt( String title ) {
        System.out.print( title + ": " );

        return getInt();
    }
    public static int getInt() {
        String d;

        d = input.nextLine();

        while (!isInt( d )) {
            System.out.print( "Wrong number format. Try again: " );
            d = input.nextLine();
        }

        return Integer.parseInt( d );
    }

    public static String waitForResponse( String title ) {
        System.out.print( title );
        String response = input.nextLine();

        return response;
    }
    public static String waitForResponse( String title, String... responses ) {
        System.out.print( title + " [" + String.join( "/", responses ) + "]: " );
        String response = input.nextLine();

        while (!isGoodResponse( response, responses )) {
            System.out.print( "Wrong response. Try again. [" + String.join( "/", responses ) + "]:" );
            response = input.nextLine();
        }

        return response;
    }
    public static String waitForResponse( String title, Pattern pattern ) {
        System.out.print( title + " [ Wzór: " + pattern + "]: " );
        String response = input.nextLine();

        while (!pattern.matcher( response ).matches()) {
            System.out.print( "Wrong response. Try again. [ Wzór: " + pattern + "]: " );
            response = input.nextLine();
        }

        return response;
    }

    public static boolean isGoodResponse(String response, String... responses ) {
        for ( String res : responses )
            if (res.equals( response )) return true;

        return false;
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
}
