package io.github.evolveye;

import java.time.LocalTime;
import java.util.ArrayList;

interface MenuLambda {
    void doMenuAction();
}

public class Utils {
    private static boolean running = true;
    private static ArrayList<String> menuTitles = new ArrayList<>();
    private static ArrayList<MenuLambda> menuLambdas = new ArrayList<>();

    public static void printInfo( String[] labels ) {
        System.out.println( " |" );

        for (int i = 0; i < labels.length; i++) {
            System.out.println( " | " + labels[ i ] );
        }

        System.out.println( " |\n" );
    }

    public static void addMenuItem( String title, MenuLambda menuLambda ) {
        menuTitles.add( title );
        menuLambdas.add( menuLambda );
    }
    public static void generateMenu() {
        int index = 1;
        String[] optionsIndices = new String[ menuTitles.size() ];

        System.out.print( "\n | What you want to do?" );

        for (String menuTitle : menuTitles) {
            optionsIndices[ index - 1 ] = "" + index;

            System.out.print( "\n [ " + index++ + " ]: " + menuTitle );
        }

        System.out.print( "\n |> Your response: " );
        String response = InputUtils.readLine();

        while (!InputUtils.isGoodResponse( response, optionsIndices )) {
            System.out.print( " |> Wrong response! Try again: " );
            response = InputUtils.readLine();
        }

        menuLambdas.get( Integer.parseInt( response ) - 1 ).doMenuAction();
    }
    public static void startMenuLoop() {
        do {
            Utils.generateMenu();
        } while( running );
    }
    public static void endMenuLoop() {
        running = false;
    }

    public static boolean goodTimes( LocalTime startTime, LocalTime endTime, LocalTime startLimit, LocalTime endLimit ) {
        int hoursStart = startTime.getHour();
        int hoursEnd = endTime.getHour();

        int minutesStart = startTime.getMinute();
        int minutesEnd = endTime.getMinute();

        int hoursStartLimit = startLimit.getHour();
        int hoursEndLimit = endLimit.getHour();

        int minutesStartLimit = startLimit.getMinute();
        int minutesEndLimit = endLimit.getMinute();

        if (hoursStart > hoursStartLimit || hoursStart == hoursStartLimit && minutesStart >= minutesStartLimit) return false;
        if (hoursEndLimit > hoursEnd || hoursEndLimit == hoursEnd && minutesEndLimit >= minutesEnd) return false;

        return hoursStart <= hoursEnd && (hoursStart != hoursEnd || minutesStart < minutesEnd);
    }
    public static boolean goodTimes( LocalTime startTime, LocalTime endTime ) {
        return goodTimes( startTime, endTime, startTime, endTime );
    }
    public static String getTime( LocalTime date ) {
        String h = "" + date.getHour();
        String m = "" + date.getMinute();
        String s = "" + date.getSecond();

        if (h.length() == 1) h = "0" + h;
        if (m.length() == 1) m = "0" + m;
        if (s.length() == 1) s = "0" + s;

        return h + ":" + m + ":" + s;
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