import java.time.LocalDate;
import java.util.Scanner;

public class getAge
{
	public static void main(String[] args) {
        Scanner SC = new Scanner(System.in);
        int GET_YEAR_NOW;
        int GET_YEAR;
        int CALC_AGE;

		GET_YEAR_NOW = LocalDate.now().getYear();

        System.out.println("Enter your birthyear: ");
        GET_YEAR = SC.nextInt();

        CALC_AGE = GET_YEAR_NOW - GET_YEAR;

        System.out.print("Your age is " + CALC_AGE);
		
        SC.close();
	}
}
