import { AuthService } from "@web/services/AuthService";
import "@web/components/AdminSidebarComponent";
import "@web/components/contact/ContactPageComponent";

void new AuthService().checkAdminAccess();
