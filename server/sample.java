import java.util.Scanner;

public class sample {  // Class name matches the filename
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a sentence: ");
        String sentence = scanner.nextLine();
        scanner.close();

        System.out.println("First letters: " + getFirstLetters(sentence));
    }

    public static String getFirstLetters(String sentence) {
        String[] words = sentence.split("\\s+"); // Split by spaces
        StringBuilder firstLetters = new StringBuilder();

        for (String word : words) {
            if (!word.isEmpty()) {
                firstLetters.append(word.charAt(0));
            }
        }

        return firstLetters.toString();
    }
}
