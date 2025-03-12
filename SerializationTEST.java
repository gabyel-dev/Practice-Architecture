import java.io.*;

class User {
    private final String email;

    public User(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}

public class SerializationTEST {
    private static final String FILE_NAME = "user_email.txt";

    public static void main(String[] args) {
        User user = new User("gab@gmail.com");

        try {
            saveText(user);
            System.out.println("User email saved to text file successfully!");
            
            User deserializedUser = readText();
            System.out.println("Deserialized User Email: " + deserializedUser.getEmail());
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

    private static void saveText(User user) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_NAME))) {
            writer.write(user.getEmail());
        }
    }

    private static User readText() throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_NAME))) {
            String email = reader.readLine();
            return email != null ? new User(email) : null; 
        }
}}