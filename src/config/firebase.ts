import admin from "firebase-admin";
import serviceAccount from "../../herdeen-01-firebase-adminsdk-fbsvc-b8bcdaedf4.json";

if (!admin.app.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
