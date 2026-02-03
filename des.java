import java.util.*;
import javax.crypto.*;
import javax.crypto.spec.*;
public class des{
 public static void main(String args[]) throws Exception{
 Scanner sc = new Scanner(System.in);
 // take message to encrypt
 System.out.print("Enter message to encrypt: ");
 String msg = sc.nextLine();
 byte[] message = msg.getBytes();
 // take custom key and prepare key
 System.out.print("Enter custom key: ");
 String key = sc.nextLine();
 byte[] keyData = key.getBytes();
 DESKeySpec secretKey = new DESKeySpec(keyData);
 SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
 SecretKey keyN = keyFactory.generateSecret(secretKey);
 // ENCRYPTION
 Cipher cipher = Cipher.getInstance("DES");
 cipher.init(Cipher.ENCRYPT_MODE, keyN);
 byte[] encrypted = cipher.doFinal(message);
 //DECRYPTION
 cipher.init(Cipher.DECRYPT_MODE, keyN);
 byte[] decrypted = cipher.doFinal(encrypted);
 String decryptedMsg = new String(decrypted);
 // OUTPUT
 System.out.println("Message: " + msg);
 System.out.println("Encrypted: " + encrypted);
 System.out.println("Decrypted: " + decryptedMsg);
 }
}